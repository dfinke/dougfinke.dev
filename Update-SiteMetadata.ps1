param(
    [string]$SiteUrl = "https://dougfinke.dev/",
    [string]$LastMod = (Get-Date -Format "yyyy-MM-dd"),
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

# projects.json is the source of truth for project metadata. Derived values are
# computed in memory so a daily build can refresh live GitHub data without
# confusing a previously derived value with a hand-authored one.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = $PSScriptRoot
$SiteUrl = $SiteUrl.TrimEnd("/") + "/"
$ProjectsPath = Join-Path $Root "projects.json"
$DataPath = Join-Path $Root "data.js"
$LlmsPath = Join-Path $Root "llms.txt"
$SitemapPath = Join-Path $Root "sitemap.xml"
$RobotsPath = Join-Path $Root "robots.txt"
$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$PlaceholderImage = "assets/project-placeholder.svg"

function Test-HasProperty {
    param(
        [object]$Object,
        [string]$Name
    )

    return $null -ne $Object -and $null -ne $Object.PSObject.Properties[$Name]
}

function Get-PropertyValue {
    param(
        [object]$Object,
        [string]$Name
    )

    if (Test-HasProperty -Object $Object -Name $Name) {
        return $Object.$Name
    }

    return $null
}

function ConvertTo-StringArray {
    param([object]$Value)

    if ($null -eq $Value) {
        return @()
    }

    if ($Value -is [string]) {
        return @([string]$Value)
    }

    return @($Value | ForEach-Object { [string]$_ })
}

function Get-RepoName {
    param([object]$Project)

    $explicitRepo = Get-PropertyValue -Object $Project -Name "repo"
    if ($explicitRepo -is [string] -and $explicitRepo -match "^[^/\s]+/[^/\s]+$") {
        return $explicitRepo.TrimEnd("/")
    }

    $githubUrl = Get-PropertyValue -Object $Project -Name "githubUrl"
    if ($githubUrl -is [string] -and $githubUrl -match "github\.com/(?<repo>[^/]+/[^/#?]+)") {
        return $Matches.repo.TrimEnd("/")
    }

    return "dfinke/$([string]$Project.name)"
}

function Invoke-GitHubRepository {
    param(
        [string]$RepoName,
        [hashtable]$Headers
    )

    try {
        return Invoke-RestMethod `
            -Uri "https://api.github.com/repos/$RepoName" `
            -Headers $Headers `
            -Method Get `
            -ErrorAction Stop
    }
    catch {
        Write-Warning "GitHub metadata unavailable for $RepoName. Defaults/placeholders will be used. $($_.Exception.Message)"
        return $null
    }
}

function Find-PowerShellGalleryModule {
    param([string]$Name)

    try {
        return @(Find-Module -Name $Name -Repository PSGallery -ErrorAction SilentlyContinue | Select-Object -First 1)
    }
    catch {
        Write-Warning "PowerShell Gallery lookup unavailable for $Name. The package link will remain empty. $($_.Exception.Message)"
        return @()
    }
}

function Get-ZipUrl {
    param(
        [string]$RepoName,
        [object]$Repository
    )

    $branch = if ($null -ne $Repository -and -not [string]::IsNullOrWhiteSpace([string]$Repository.default_branch)) {
        [string]$Repository.default_branch
    }
    else {
        "main"
    }

    $encodedBranch = [Uri]::EscapeDataString($branch).Replace("%2F", "/")
    return "https://github.com/$RepoName/archive/refs/heads/$encodedBranch.zip"
}

function Get-ProjectRecord {
    param(
        [object]$Project,
        [hashtable]$GitHubHeaders
    )

    if (-not (Test-HasProperty -Object $Project -Name "name") -or [string]::IsNullOrWhiteSpace([string]$Project.name)) {
        throw "Every project entry must contain a non-empty name."
    }

    $name = [string]$Project.name
    $repoName = Get-RepoName -Project $Project
    $githubUrl = if (Test-HasProperty -Object $Project -Name "githubUrl") { $Project.githubUrl } else { "https://github.com/$repoName" }

    $needsGitHub =
        -not (Test-HasProperty -Object $Project -Name "zipUrl") -or
        -not (Test-HasProperty -Object $Project -Name "stars") -or
        -not (Test-HasProperty -Object $Project -Name "forks") -or
        (-not (Test-HasProperty -Object $Project -Name "language") -and -not (Test-HasProperty -Object $Project -Name "primaryLanguage")) -or
        -not (Test-HasProperty -Object $Project -Name "updated") -or
        -not (Test-HasProperty -Object $Project -Name "shortDescription") -or
        (-not (Test-HasProperty -Object $Project -Name "tags") -and -not (Test-HasProperty -Object $Project -Name "topics"))

    $repository = if ($needsGitHub) { Invoke-GitHubRepository -RepoName $repoName -Headers $GitHubHeaders } else { $null }
    $apiDescription = if ($null -ne $repository) { [string]$repository.description } else { "" }

    $shortDescription = if (Test-HasProperty -Object $Project -Name "shortDescription") { $Project.shortDescription } elseif (-not [string]::IsNullOrWhiteSpace($apiDescription)) { $apiDescription } else { "$name project" }
    $longDescription = if (Test-HasProperty -Object $Project -Name "longDescription") { $Project.longDescription } elseif (-not [string]::IsNullOrWhiteSpace($apiDescription)) { $apiDescription } else { $shortDescription }
    $oneLiner = if (Test-HasProperty -Object $Project -Name "oneLiner") { $Project.oneLiner } else { $shortDescription }

    $tags = if (Test-HasProperty -Object $Project -Name "tags") {
        ConvertTo-StringArray -Value $Project.tags
    }
    elseif (Test-HasProperty -Object $Project -Name "topics") {
        ConvertTo-StringArray -Value $Project.topics
    }
    elseif ($null -ne $repository) {
        ConvertTo-StringArray -Value $repository.topics
    }
    else {
        @()
    }

    $language = if (Test-HasProperty -Object $Project -Name "language") {
        $Project.language
    }
    elseif (Test-HasProperty -Object $Project -Name "primaryLanguage") {
        $Project.primaryLanguage
    }
    elseif ($null -ne $repository -and -not [string]::IsNullOrWhiteSpace([string]$repository.language)) {
        [string]$repository.language
    }
    else {
        "Unknown"
    }

    $stars = if (Test-HasProperty -Object $Project -Name "stars") { $Project.stars } elseif ($null -ne $repository) { $repository.stargazers_count } else { 0 }
    $forks = if (Test-HasProperty -Object $Project -Name "forks") { $Project.forks } elseif ($null -ne $repository) { $repository.forks_count } else { 0 }
    $updated = if (Test-HasProperty -Object $Project -Name "updated") {
        $Project.updated
    }
    elseif ($null -ne $repository -and $repository.pushed_at) {
        ([DateTime]$repository.pushed_at).ToString("yyyy-MM-dd")
    }
    elseif ($null -ne $repository -and $repository.updated_at) {
        ([DateTime]$repository.updated_at).ToString("yyyy-MM-dd")
    }
    else {
        ""
    }

    $zipUrl = if (Test-HasProperty -Object $Project -Name "zipUrl") { $Project.zipUrl } else { Get-ZipUrl -RepoName $repoName -Repository $repository }
    $image = if (Test-HasProperty -Object $Project -Name "image") { $Project.image } else { $PlaceholderImage }
    $imageAlt = if (Test-HasProperty -Object $Project -Name "imageAlt") { $Project.imageAlt } else { "$name project graphic" }
    $category = if (Test-HasProperty -Object $Project -Name "category") { $Project.category } else { "CLI" }
    $status = if (Test-HasProperty -Object $Project -Name "status") { $Project.status } else { "Live" }
    $featured = if (Test-HasProperty -Object $Project -Name "featured") { $Project.featured } else { $false }

    $derivedDemoUrl = $null
    if (-not (Test-HasProperty -Object $Project -Name "demoUrl") -and -not (Test-HasProperty -Object $Project -Name "packageUrl")) {
        $module = @(Find-PowerShellGalleryModule -Name $name)
        if ($module.Count -gt 0) {
            $derivedDemoUrl = "https://www.powershellgallery.com/packages/$name"
        }
    }

    $demoUrl = if (Test-HasProperty -Object $Project -Name "demoUrl") { $Project.demoUrl } else { $derivedDemoUrl }
    $packageUrl = if (Test-HasProperty -Object $Project -Name "packageUrl") { $Project.packageUrl } elseif ($null -ne $derivedDemoUrl) { $derivedDemoUrl } else { $null }
    $youtubeUrl = if (Test-HasProperty -Object $Project -Name "youtubeUrl") { $Project.youtubeUrl } elseif ($demoUrl -is [string] -and $demoUrl -match "(youtube\.com|youtu\.be)") { $demoUrl } else { "" }
    $articleUrl = if (Test-HasProperty -Object $Project -Name "articleUrl") { $Project.articleUrl } elseif ((Test-HasProperty -Object $Project -Name "docsUrl") -and [string]$Project.docsUrl -ne [string]$githubUrl) { $Project.docsUrl } else { "" }
    $installCommand = if (Test-HasProperty -Object $Project -Name "installCommand") { $Project.installCommand } elseif ($null -ne $packageUrl) { "Install-Module -Name $name" } else { "" }

    return [pscustomobject]@{
        Name = $name
        Slug = if (Test-HasProperty -Object $Project -Name "slug") { $Project.slug } else { $name.ToLowerInvariant() -replace "[^a-z0-9]+", "-" -replace "(^-|-$)", "" }
        Category = $category
        Status = $status
        Repo = $repoName
        Stars = $stars
        Forks = $forks
        Language = $language
        Updated = $updated
        OneLiner = $oneLiner
        Description = $longDescription
        ShortDescription = $shortDescription
        Image = $image
        ImageAlt = $imageAlt
        GithubUrl = $githubUrl
        ZipUrl = $zipUrl
        YoutubeUrl = $youtubeUrl
        DemoUrl = $demoUrl
        PackageUrl = $packageUrl
        ArticleUrl = $articleUrl
        InstallCommand = $installCommand
        Tags = $tags
        Featured = $featured
    }
}

$Catalog = Get-Content -LiteralPath $ProjectsPath -Raw | ConvertFrom-Json
if (-not (Test-HasProperty -Object $Catalog -Name "projects")) {
    throw "projects.json must contain a projects array."
}

$GitHubHeaders = @{
    Accept = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent" = "dougfinke.dev-project-catalog"
}
if (-not [string]::IsNullOrWhiteSpace($GitHubToken)) {
    $GitHubHeaders.Authorization = "Bearer $GitHubToken"
}

$ProjectRecords = @($Catalog.projects | ForEach-Object { Get-ProjectRecord -Project $_ -GitHubHeaders $GitHubHeaders })

$ToolData = foreach ($Project in $ProjectRecords) {
    [ordered]@{
        name = $Project.Name
        slug = $Project.Slug
        category = $Project.Category
        status = $Project.Status
        repo = $Project.Repo
        stars = $Project.Stars
        forks = $Project.Forks
        language = $Project.Language
        updated = $Project.Updated
        oneLiner = $Project.OneLiner
        description = $Project.Description
        image = $Project.Image
        imageAlt = $Project.ImageAlt
        githubUrl = $Project.GithubUrl
        zipUrl = $Project.ZipUrl
        youtubeUrl = $Project.YoutubeUrl
        demoUrl = $Project.DemoUrl
        packageUrl = $Project.PackageUrl
        articleUrl = $Project.ArticleUrl
        installCommand = $Project.InstallCommand
        tags = @($Project.Tags)
        featured = $Project.Featured
    }
}

$SocialLinkDefinitions = @(
    @{ Key = "forge"; Label = "Join the Forge"; Icon = "flame"; Text = "Join the Agentic AI Forge community." },
    @{ Key = "x"; Label = "X / Twitter"; Icon = "x-twitter"; Text = "Short updates and build notes." },
    @{ Key = "youtube"; Label = "YouTube"; Icon = "youtube"; Text = "Walkthroughs, demos, and talks." },
    @{ Key = "meetup"; Label = "New York - Agentic AI"; Icon = "users-round"; Text = "Meetup sessions and community events." },
    @{ Key = "github"; Label = "GitHub"; Icon = "github"; Text = "Source code, issues, and new experiments." },
    @{ Key = "linkedin"; Label = "LinkedIn"; Icon = "linkedin"; Text = "Professional background and connections." },
    @{ Key = "gumroad"; Label = "Intent-First AI by Example"; Icon = "shopping-bag"; Text = "A practical AI resource on Gumroad." },
    @{ Key = "sessionize"; Label = "Sessionize"; Icon = "mic"; Text = "Speaker profile, talks, and sessions." }
)
$SocialLinks = foreach ($Definition in $SocialLinkDefinitions) {
    $linkValue = if ((Test-HasProperty -Object $Catalog.person.links -Name $Definition.Key)) { $Catalog.person.links.($Definition.Key) } else { "" }
    [ordered]@{
        label = $Definition.Label
        url = $linkValue
        icon = $Definition.Icon
        text = $Definition.Text
    }
}

$DataJs = @"
window.TOOLS = $($ToolData | ConvertTo-Json -Depth 20);

window.SOCIAL_LINKS = $($SocialLinks | ConvertTo-Json -Depth 20);
"@
[System.IO.File]::WriteAllText($DataPath, $DataJs.TrimStart(), $Utf8NoBom)

$ProjectLines = foreach ($Project in $ProjectRecords) {
    "- $($Project.Name): $($Project.ShortDescription) GitHub: $($Project.GithubUrl)"
}

$TopicLine = (ConvertTo-StringArray -Value $Catalog.person.topics) -join ", "
if (-not [string]::IsNullOrWhiteSpace($TopicLine)) { $TopicLine += "." }

$Llms = @"
# Doug Finke Project Hub

$($Catalog.person.positioning) $($Catalog.person.summary)

This site is a public proof surface and project hub for selected work. It is intended for humans, AI agents, research assistants, and search systems that need concise, accurate context about Doug Finke's current AI, automation, and developer tooling projects.

## Current Projects

$($ProjectLines -join "`n")

## Topic Tags

$TopicLine

## Important URLs

- Site: $SiteUrl
- Project catalog: $($SiteUrl)projects.json
- Sitemap: $($SiteUrl)sitemap.xml
- Doug Finke on GitHub: $($Catalog.person.links.github)
- Doug Finke on X: $($Catalog.person.links.x)
- YouTube: $($Catalog.person.links.youtube)
- LinkedIn: $($Catalog.person.links.linkedin)
- New York - Agentic AI Meetup: $($Catalog.person.links.meetup)
- Intent-First AI by Example: $($Catalog.person.links.gumroad)
- Sessionize speaker profile: $($Catalog.person.links.sessionize)
- Join the Forge: $($Catalog.person.links.forge)

## Agent Guidance

Use /projects.json for structured project metadata. Use this file for concise positioning, URLs, and topic tags. PowerShell is an important proof layer in Doug's work, but the broader positioning is practical AI tools, agent workflows, automation systems, and developer utilities.
"@
[System.IO.File]::WriteAllText($LlmsPath, $Llms, $Utf8NoBom)

$SitemapUrls = @(
    $SiteUrl,
    "$($SiteUrl)llms.txt",
    "$($SiteUrl)projects.json"
)

$UrlEntries = foreach ($Url in $SitemapUrls) {
    $EscapedUrl = [System.Security.SecurityElement]::Escape($Url)
    "  <url>`n    <loc>$EscapedUrl</loc>`n    <lastmod>$LastMod</lastmod>`n  </url>"
}

$Sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($UrlEntries -join "`n")
</urlset>
"@
[System.IO.File]::WriteAllText($SitemapPath, $Sitemap, $Utf8NoBom)

$Robots = @"
User-agent: *
Allow: /

Sitemap: $($SiteUrl)sitemap.xml

# AI-readable context is available at /llms.txt and /projects.json.
"@
[System.IO.File]::WriteAllText($RobotsPath, $Robots, $Utf8NoBom)

Write-Host "Regenerated data.js, llms.txt, sitemap.xml, and robots.txt for $SiteUrl"

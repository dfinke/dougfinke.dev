param(
    [string]$SiteUrl = "https://dfinke.github.io/dougfinke.dev/",
    [string]$LastMod = (Get-Date -Format "yyyy-MM-dd")
)

# projects.json is the source of truth for AI-readable project metadata.
# Run this script after editing projects.json or changing the public site URL.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = $PSScriptRoot
$SiteUrl = $SiteUrl.TrimEnd("/") + "/"
$ProjectsPath = Join-Path $Root "projects.json"
$LlmsPath = Join-Path $Root "llms.txt"
$SitemapPath = Join-Path $Root "sitemap.xml"
$RobotsPath = Join-Path $Root "robots.txt"
$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$Catalog = Get-Content -LiteralPath $ProjectsPath -Raw | ConvertFrom-Json

# Normalize projects.json so it remains valid, consistently formatted JSON.
[System.IO.File]::WriteAllText($ProjectsPath, ($Catalog | ConvertTo-Json -Depth 20), $Utf8NoBom)

$ProjectLines = foreach ($Project in $Catalog.projects) {
    "- $($Project.name): $($Project.shortDescription) GitHub: $($Project.githubUrl)"
}

$TopicLine = ($Catalog.person.topics -join ", ") + "."

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

Write-Host "Regenerated projects.json, llms.txt, sitemap.xml, and robots.txt for $SiteUrl"

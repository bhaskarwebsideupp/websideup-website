$cwd = "d:\WEBSITE WEBSDIEUP"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Prefixes.Add("http://127.0.0.1:3000/")
$listener.Start()
Write-Host "Server running at http://localhost:3000/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".mp4"  = "video/mp4"
    ".woff2"= "font/woff2"
    ".json" = "application/json; charset=utf-8"
}

$worker = {
    param($context, $cwd, $mimeTypes)
    try {
        $req = $context.Request
        $res = $context.Response

        $rawPath = [System.Uri]::UnescapeDataString($req.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrEmpty($rawPath)) { $rawPath = "index.html" }

        if ($rawPath -match '^work/([^/]+)$') {
            $rawPath = "work.html"
        } elseif ($rawPath -match '^insights/([^/]+)$') {
            $rawPath = "article.html"
        } elseif (-not [System.IO.Path]::HasExtension($rawPath)) {
            if (Test-Path (Join-Path $cwd ($rawPath + ".html"))) {
                $rawPath = $rawPath + ".html"
            }
        }

        $filePath = Join-Path $cwd $rawPath
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $fi = New-Object System.IO.FileInfo($filePath)
            $totalLength = $fi.Length

            $res.ContentType = $contentType
            $res.AddHeader("Accept-Ranges", "bytes")
            $res.AddHeader("Access-Control-Allow-Origin", "*")

            $rangeHeader = $req.Headers["Range"]
            if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                $parts = $rangeHeader.Substring(6).Split('-')
                $start = 0L
                $end = $totalLength - 1L
                if (![string]::IsNullOrEmpty($parts[0])) { [long]::TryParse($parts[0], [ref]$start) | Out-Null }
                if ($parts.Length -gt 1 -and ![string]::IsNullOrEmpty($parts[1])) { [long]::TryParse($parts[1], [ref]$end) | Out-Null }
                if ($end -ge $totalLength) { $end = $totalLength - 1L }

                $contentLength = $end - $start + 1L
                $res.StatusCode = 206
                $res.ContentLength64 = $contentLength
                $res.AddHeader("Content-Range", "bytes $start-$end/$totalLength")

                if ($req.HttpMethod -ne 'HEAD') {
                    $fs = [System.IO.File]::OpenRead($filePath)
                    try {
                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $buffer = New-Object byte[] 65536
                        $remaining = $contentLength
                        while ($remaining -gt 0) {
                            $toRead = [int][Math]::Min(65536L, $remaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $res.OutputStream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                    } finally {
                        $fs.Close()
                    }
                }
            } else {
                $res.StatusCode = 200
                $res.ContentLength64 = $totalLength
                if ($req.HttpMethod -ne 'HEAD') {
                    $fs = [System.IO.File]::OpenRead($filePath)
                    try {
                        $fs.CopyTo($res.OutputStream)
                    } finally {
                        $fs.Close()
                    }
                }
            }
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.ContentLength64 = $msg.Length
            if ($req.HttpMethod -ne 'HEAD') {
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
        $res.OutputStream.Close()
    } catch {
        # Client disconnect
    }
}

$iss = [System.Management.Automation.Runspaces.InitialSessionState]::CreateDefault()
$pool = [System.Management.Automation.Runspaces.RunspaceFactory]::CreateRunspacePool(1, 16, $iss, $Host)
$pool.Open()

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $ps = [powershell]::Create()
        $ps.RunspacePool = $pool
        $ps.AddScript($worker).AddArgument($context).AddArgument($cwd).AddArgument($mimeTypes) | Out-Null
        $ps.BeginInvoke() | Out-Null
    } catch {
        # Listener closed
    }
}




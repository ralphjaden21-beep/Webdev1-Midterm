Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function New-Color {
  param([string]$Hex)
  return [System.Drawing.ColorTranslator]::FromHtml($Hex)
}

function New-Font {
  param(
    [string]$Family,
    [float]$Size,
    [System.Drawing.FontStyle]$Style = [System.Drawing.FontStyle]::Regular
  )
  return New-Object System.Drawing.Font($Family, $Size, $Style, [System.Drawing.GraphicsUnit]::Pixel)
}

function New-RoundedPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2

  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-RoundedBox {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius,
    [System.Drawing.Color]$FillColor,
    [System.Drawing.Color]$BorderColor,
    [float]$BorderWidth = 2
  )

  $path = New-RoundedPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  $brush = New-Object System.Drawing.SolidBrush($FillColor)
  $pen = New-Object System.Drawing.Pen($BorderColor, $BorderWidth)
  $pen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Inset
  $Graphics.FillPath($brush, $path)
  $Graphics.DrawPath($pen, $path)
  $brush.Dispose()
  $pen.Dispose()
  $path.Dispose()
}

function Draw-TextBlock {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [System.Drawing.Color]$Color,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [string]$Align = "Left"
  )

  $brush = New-Object System.Drawing.SolidBrush($Color)
  $format = New-Object System.Drawing.StringFormat
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  switch ($Align) {
    "Center" { $format.Alignment = [System.Drawing.StringAlignment]::Center }
    "Right" { $format.Alignment = [System.Drawing.StringAlignment]::Far }
    default { $format.Alignment = [System.Drawing.StringAlignment]::Near }
  }
  $Graphics.DrawString($Text, $Font, $brush, (New-Object System.Drawing.RectangleF($X, $Y, $Width, $Height)), $format)
  $brush.Dispose()
  $format.Dispose()
}

function Draw-Arrow {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X1,
    [float]$Y1,
    [float]$X2,
    [float]$Y2,
    [System.Drawing.Color]$Color,
    [float]$Width = 3
  )

  $pen = New-Object System.Drawing.Pen($Color, $Width)
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawLine($pen, $X1, $Y1, $X2, $Y2)
  $pen.Dispose()
}

function Draw-Node {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Label,
    [string]$Caption,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [System.Drawing.Color]$FillColor,
    [System.Drawing.Color]$BorderColor,
    [System.Drawing.Font]$TitleFont,
    [System.Drawing.Font]$BodyFont,
    [System.Drawing.Color]$TextColor
  )

  Draw-RoundedBox -Graphics $Graphics -X $X -Y $Y -Width $Width -Height $Height -Radius 22 -FillColor $FillColor -BorderColor $BorderColor -BorderWidth 2
  Draw-TextBlock -Graphics $Graphics -Text $Label -Font $TitleFont -Color $TextColor -X ($X + 18) -Y ($Y + 16) -Width ($Width - 36) -Height 32
  Draw-TextBlock -Graphics $Graphics -Text $Caption -Font $BodyFont -Color (New-Color "#46606d") -X ($X + 18) -Y ($Y + 54) -Width ($Width - 36) -Height ($Height - 72)
}

function Save-Jpeg {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 92L)
  $Bitmap.Save($Path, $codec, $encoderParams)
  $encoderParams.Dispose()
}

function Draw-SectionLabel {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [System.Drawing.Font]$Font
  )

  Draw-TextBlock -Graphics $Graphics -Text $Text -Font $Font -Color (New-Color "#5f7f87") -X $X -Y $Y -Width $Width -Height 24
}

function New-Canvas {
  param(
    [int]$Width,
    [int]$Height
  )

  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bmp)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $graphics.Clear((New-Color "#f4faf9"))
  return @{ Bitmap = $bmp; Graphics = $graphics }
}

function Add-SoftBackground {
  param([System.Drawing.Graphics]$Graphics)

  $topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, 1600, 900)),
    (New-Color "#f7fcfb"),
    (New-Color "#e8f4f2"),
    90
  )
  $Graphics.FillRectangle($topBrush, 0, 0, 1600, 900)
  $topBrush.Dispose()

  $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, (New-Color "#8bd2c7")))
  $Graphics.FillEllipse($accentBrush, 1080, -80, 420, 300)
  $Graphics.FillEllipse($accentBrush, -90, 620, 360, 260)
  $accentBrush.Dispose()
}

function Generate-Sitemap {
  param([string]$OutputPath)

  $canvas = New-Canvas -Width 1600 -Height 900
  $bmp = $canvas.Bitmap
  $g = $canvas.Graphics
  Add-SoftBackground -Graphics $g

  $titleFont = New-Font -Family "Segoe UI Semibold" -Size 28
  $subtitleFont = New-Font -Family "Segoe UI" -Size 14
  $nodeTitleFont = New-Font -Family "Segoe UI Semibold" -Size 19
  $nodeBodyFont = New-Font -Family "Segoe UI" -Size 13
  $sectionFont = New-Font -Family "Segoe UI Semibold" -Size 13

 Draw-TextBlock -Graphics $g -Text "HealthSync Clinic Sitemap" -Font $titleFont -Color (New-Color "#173a45") -X 72 -Y 48 -Width 720 -Height 42

  Draw-SectionLabel -Graphics $g -Text "PUBLIC EXPERIENCE" -X 120 -Y 160 -Width 320 -Font $sectionFont
  Draw-SectionLabel -Graphics $g -Text "SECURE PORTAL" -X 680 -Y 160 -Width 220 -Font $sectionFont
  Draw-SectionLabel -Graphics $g -Text "ROLE OUTPUTS" -X 1080 -Y 160 -Width 220 -Font $sectionFont

  $publicFill = New-Color "#ffffff"
  $publicBorder = New-Color "#98cbc4"
  $portalFill = New-Color "#fefaf2"
  $portalBorder = New-Color "#e1be72"
  $roleFill = New-Color "#f7f5ff"
  $roleBorder = New-Color "#b3a9ee"
  $textColor = New-Color "#173a45"

  Draw-Node -Graphics $g -Label "index.html" -Caption "" -X 86 -Y 206 -Width 320 -Height 96 -FillColor $publicFill -BorderColor $publicBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor
  Draw-Node -Graphics $g -Label "Wizard (#wizard)" -Caption "" -X 86 -Y 364 -Width 320 -Height 96 -FillColor $publicFill -BorderColor $publicBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor

  Draw-Node -Graphics $g -Label "login.html" -Caption "" -X 636 -Y 286 -Width 320 -Height 96 -FillColor $portalFill -BorderColor $portalBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor

  Draw-Node -Graphics $g -Label "default-dashboard.html" -Caption "" -X 1058 -Y 170 -Width 430 -Height 96 -FillColor $roleFill -BorderColor $roleBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor
  Draw-Node -Graphics $g -Label "admin-dashboard.html" -Caption "" -X 1058 -Y 292 -Width 430 -Height 96 -FillColor $roleFill -BorderColor $roleBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor
  Draw-Node -Graphics $g -Label "staff-dashboard.html" -Caption "" -X 1058 -Y 414 -Width 430 -Height 96 -FillColor $roleFill -BorderColor $roleBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor
  Draw-Node -Graphics $g -Label "user-dashboard.html" -Caption "" -X 1058 -Y 536 -Width 430 -Height 96 -FillColor $roleFill -BorderColor $roleBorder -TitleFont $nodeTitleFont -BodyFont $nodeBodyFont -TextColor $textColor

  Draw-Arrow -Graphics $g -X1 406 -Y1 252 -X2 636 -Y2 334 -Color (New-Color "#6ea89c")
  Draw-Arrow -Graphics $g -X1 406 -Y1 412 -X2 636 -Y2 334 -Color (New-Color "#6ea89c")
  Draw-Arrow -Graphics $g -X1 956 -Y1 334 -X2 1058 -Y2 218 -Color (New-Color "#d1a746")
  Draw-Arrow -Graphics $g -X1 956 -Y1 334 -X2 1058 -Y2 340 -Color (New-Color "#d1a746")
  Draw-Arrow -Graphics $g -X1 956 -Y1 334 -X2 1058 -Y2 462 -Color (New-Color "#d1a746")
  Draw-Arrow -Graphics $g -X1 956 -Y1 334 -X2 1058 -Y2 584 -Color (New-Color "#d1a746")

  Save-Jpeg -Bitmap $bmp -Path $OutputPath

  $titleFont.Dispose()
  $subtitleFont.Dispose()
  $nodeTitleFont.Dispose()
  $nodeBodyFont.Dispose()
  $sectionFont.Dispose()
  $g.Dispose()
  $bmp.Dispose()
}

function Draw-UiCard {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [string]$Title,
    [string]$Note,
    [System.Drawing.Font]$TitleFont,
    [System.Drawing.Font]$BodyFont
  )

  Draw-RoundedBox -Graphics $Graphics -X $X -Y $Y -Width $Width -Height $Height -Radius 20 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d8e8e5")
  Draw-TextBlock -Graphics $Graphics -Text $Title -Font $TitleFont -Color (New-Color "#19353e") -X ($X + 18) -Y ($Y + 14) -Width ($Width - 36) -Height 26
  Draw-TextBlock -Graphics $Graphics -Text $Note -Font $BodyFont -Color (New-Color "#657d84") -X ($X + 18) -Y ($Y + 42) -Width ($Width - 36) -Height 22
}

function Generate-Wireframe {
  param([string]$OutputPath)

  $canvas = New-Canvas -Width 1600 -Height 900
  $bmp = $canvas.Bitmap
  $g = $canvas.Graphics
  Add-SoftBackground -Graphics $g

  $titleFont = New-Font -Family "Segoe UI Semibold" -Size 28
  $subtitleFont = New-Font -Family "Segoe UI" -Size 14
  $sectionFont = New-Font -Family "Segoe UI Semibold" -Size 18
  $smallFont = New-Font -Family "Segoe UI" -Size 12
  $labelFont = New-Font -Family "Segoe UI Semibold" -Size 14

  Draw-TextBlock -Graphics $g -Text "HealthSync Clinic Wireframe" -Font $titleFont -Color (New-Color "#173a45") -X 72 -Y 48 -Width 720 -Height 42

  Draw-RoundedBox -Graphics $g -X 70 -Y 150 -Width 1460 -Height 690 -Radius 26 -FillColor (New-Color "#fbfefd") -BorderColor (New-Color "#c8dfdb")
  Draw-SectionLabel -Graphics $g -Text "DESKTOP LANDING + WIZARD VIEW" -X 102 -Y 176 -Width 420 -Font $smallFont

  Draw-RoundedBox -Graphics $g -X 102 -Y 208 -Width 1396 -Height 72 -Radius 18 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d9e8e4")
  Draw-TextBlock -Graphics $g -Text "Brand / HealthSync Clinic" -Font $labelFont -Color (New-Color "#19353e") -X 130 -Y 232 -Width 320 -Height 24
  Draw-RoundedBox -Graphics $g -X 1182 -Y 224 -Width 112 -Height 36 -Radius 12 -FillColor (New-Color "#eff7f6") -BorderColor (New-Color "#cfe2dd")
  Draw-RoundedBox -Graphics $g -X 1310 -Y 224 -Width 150 -Height 36 -Radius 12 -FillColor (New-Color "#eff7f6") -BorderColor (New-Color "#cfe2dd")
  Draw-TextBlock -Graphics $g -Text "Wizard" -Font $smallFont -Color (New-Color "#4f6870") -X 1212 -Y 235 -Width 52 -Height 18 -Align "Center"
  Draw-TextBlock -Graphics $g -Text "Login" -Font $smallFont -Color (New-Color "#4f6870") -X 1358 -Y 235 -Width 52 -Height 18 -Align "Center"

  Draw-RoundedBox -Graphics $g -X 102 -Y 304 -Width 860 -Height 248 -Radius 22 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d9e8e4")
  Draw-SectionLabel -Graphics $g -Text "HERO SECTION" -X 130 -Y 328 -Width 180 -Font $smallFont
  Draw-TextBlock -Graphics $g -Text "Headline / value proposition" -Font $sectionFont -Color (New-Color "#19353e") -X 130 -Y 360 -Width 360 -Height 30
  Draw-RoundedBox -Graphics $g -X 130 -Y 468 -Width 146 -Height 40 -Radius 12 -FillColor (New-Color "#dff0ec") -BorderColor (New-Color "#9fcbc1")
  Draw-RoundedBox -Graphics $g -X 292 -Y 468 -Width 168 -Height 40 -Radius 12 -FillColor (New-Color "#f3f8f7") -BorderColor (New-Color "#d6e6e2")
  Draw-TextBlock -Graphics $g -Text "Start Booking" -Font $smallFont -Color (New-Color "#31505a") -X 154 -Y 479 -Width 98 -Height 18 -Align "Center"
  Draw-TextBlock -Graphics $g -Text "Login to Dashboard" -Font $smallFont -Color (New-Color "#31505a") -X 318 -Y 479 -Width 116 -Height 18 -Align "Center"

  Draw-RoundedBox -Graphics $g -X 554 -Y 340 -Width 372 -Height 178 -Radius 18 -FillColor (New-Color "#f5faf9") -BorderColor (New-Color "#d6e6e2")
  Draw-TextBlock -Graphics $g -Text "Care experience carousel" -Font $labelFont -Color (New-Color "#19353e") -X 578 -Y 365 -Width 220 -Height 22
  Draw-RoundedBox -Graphics $g -X 578 -Y 400 -Width 324 -Height 94 -Radius 12 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#dce9e5")
  Draw-TextBlock -Graphics $g -Text "Clinic imagery / slide preview" -Font $smallFont -Color (New-Color "#738a90") -X 642 -Y 438 -Width 194 -Height 18 -Align "Center"

  Draw-RoundedBox -Graphics $g -X 986 -Y 304 -Width 512 -Height 248 -Radius 22 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d9e8e4")
  Draw-SectionLabel -Graphics $g -Text "QUICK STATS" -X 1014 -Y 328 -Width 160 -Font $smallFont
  Draw-UiCard -Graphics $g -X 1014 -Y 360 -Width 138 -Height 74 -Title "Branches" -Note "" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1168 -Y 360 -Width 138 -Height 74 -Title "Doctors" -Note "" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1322 -Y 360 -Width 148 -Height 74 -Title "Approvals" -Note "" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1014 -Y 452 -Width 456 -Height 72 -Title "Wizard Promise" -Note "" -TitleFont $labelFont -BodyFont $smallFont

  Draw-RoundedBox -Graphics $g -X 102 -Y 580 -Width 946 -Height 224 -Radius 22 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d9e8e4")
  Draw-SectionLabel -Graphics $g -Text "APPOINTMENT WIZARD" -X 130 -Y 604 -Width 220 -Font $smallFont
  Draw-TextBlock -Graphics $g -Text "Step indicator + progress bar" -Font $labelFont -Color (New-Color "#19353e") -X 130 -Y 636 -Width 260 -Height 22
  Draw-RoundedBox -Graphics $g -X 130 -Y 668 -Width 604 -Height 14 -Radius 7 -FillColor (New-Color "#edf4f3") -BorderColor (New-Color "#d9e8e4")
  Draw-RoundedBox -Graphics $g -X 130 -Y 668 -Width 302 -Height 14 -Radius 7 -FillColor (New-Color "#9fd0c6") -BorderColor (New-Color "#9fd0c6")
  Draw-RoundedBox -Graphics $g -X 130 -Y 698 -Width 874 -Height 74 -Radius 16 -FillColor (New-Color "#f8fbfa") -BorderColor (New-Color "#d9e8e4")
  Draw-RoundedBox -Graphics $g -X 130 -Y 780 -Width 104 -Height 36 -Radius 12 -FillColor (New-Color "#f3f8f7") -BorderColor (New-Color "#d6e6e2")
  Draw-RoundedBox -Graphics $g -X 248 -Y 780 -Width 120 -Height 36 -Radius 12 -FillColor (New-Color "#dff0ec") -BorderColor (New-Color "#9fcbc1")
  Draw-TextBlock -Graphics $g -Text "Back" -Font $smallFont -Color (New-Color "#4f6870") -X 156 -Y 791 -Width 52 -Height 18 -Align "Center"
  Draw-TextBlock -Graphics $g -Text "Continue" -Font $smallFont -Color (New-Color "#31505a") -X 282 -Y 791 -Width 52 -Height 18 -Align "Center"

  Draw-RoundedBox -Graphics $g -X 1074 -Y 580 -Width 424 -Height 224 -Radius 22 -FillColor (New-Color "#ffffff") -BorderColor (New-Color "#d9e8e4")
  Draw-SectionLabel -Graphics $g -Text "LIVE SUMMARY SIDEBAR" -X 1102 -Y 604 -Width 220 -Font $smallFont
  Draw-UiCard -Graphics $g -X 1102 -Y 636 -Width 172 -Height 58 -Title "Specialty" -Note "Selected value" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1290 -Y 636 -Width 172 -Height 58 -Title "Doctor" -Note "Selected value" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1102 -Y 708 -Width 172 -Height 58 -Title "Date" -Note "Selected value" -TitleFont $labelFont -BodyFont $smallFont
  Draw-UiCard -Graphics $g -X 1290 -Y 708 -Width 172 -Height 58 -Title "Time" -Note "Selected value" -TitleFont $labelFont -BodyFont $smallFont

  Save-Jpeg -Bitmap $bmp -Path $OutputPath

  $titleFont.Dispose()
  $subtitleFont.Dispose()
  $sectionFont.Dispose()
  $smallFont.Dispose()
  $labelFont.Dispose()
  $g.Dispose()
  $bmp.Dispose()
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Generate-Sitemap -OutputPath (Join-Path $root "healthsync-sitemap.jpg")
Generate-Wireframe -OutputPath (Join-Path $root "healthsync-wireframe.jpg")

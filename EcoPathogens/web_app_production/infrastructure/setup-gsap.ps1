# 🎬 SCRIPT POWERSHELL - COPIAR PLUGINS GSAP
# Execute este script para copiar seus plugins GSAP automaticamente

Write-Host "🌳 EcoGuardians - Setup GSAP Premium" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Pasta de destino
$destinoGSAP = "C:\projtos pessoais\NASA\EcoPathogens\web_app_production\frontend\public\assets\js\gsap"

Write-Host ""
Write-Host "📁 PASTA DE DESTINO: $destinoGSAP" -ForegroundColor Cyan
Write-Host ""

# Verificar se a pasta existe
if (!(Test-Path $destinoGSAP)) {
    Write-Host "❌ Pasta de destino não encontrada!" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o comando de criação da estrutura" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔍 PROCURANDO SEUS PLUGINS GSAP..." -ForegroundColor Yellow
Write-Host ""

# Locais comuns onde os plugins podem estar
$possiveisLocais = @(
    "$env:USERPROFILE\Downloads\gsap*",
    "$env:USERPROFILE\Desktop\gsap*",
    "$env:USERPROFILE\Documents\gsap*",
    "C:\gsap*",
    "C:\GSAP*",
    "$env:USERPROFILE\Downloads\*.js",
    "$env:USERPROFILE\Desktop\*.js"
)

$localEncontrado = $null

foreach ($local in $possiveisLocais) {
    $arquivos = Get-ChildItem -Path $local -Include "gsap*.js", "ScrollTrigger*.js", "MorphSVG*.js" -ErrorAction SilentlyContinue
    if ($arquivos.Count -gt 0) {
        $localEncontrado = Split-Path $arquivos[0].FullName
        Write-Host "✅ ENCONTRADO: $localEncontrado" -ForegroundColor Green
        Write-Host "📄 Arquivos encontrados: $($arquivos.Count)" -ForegroundColor Cyan
        break
    }
}

if ($localEncontrado) {
    Write-Host ""
    $resposta = Read-Host "🚀 Copiar plugins de '$localEncontrado'? (S/N)"
    
    if ($resposta -eq "S" -or $resposta -eq "s" -or $resposta -eq "Y" -or $resposta -eq "y") {
        Write-Host ""
        Write-Host "📂 COPIANDO PLUGINS..." -ForegroundColor Yellow
        
        # Copiar todos os arquivos .js
        $arquivosJS = Get-ChildItem -Path "$localEncontrado\*.js"
        $copiados = 0
        
        foreach ($arquivo in $arquivosJS) {
            try {
                Copy-Item $arquivo.FullName -Destination $destinoGSAP -Force
                Write-Host "✅ $($arquivo.Name)" -ForegroundColor Green
                $copiados++
            } catch {
                Write-Host "❌ Erro ao copiar: $($arquivo.Name)" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "🎉 SUCESSO! $copiados arquivos copiados!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ PLUGINS NÃO ENCONTRADOS AUTOMATICAMENTE" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUÇÃO MANUAL:" -ForegroundColor Yellow
    Write-Host "1. Encontre a pasta com seus plugins GSAP" -ForegroundColor White
    Write-Host "2. Selecione todos os arquivos .js" -ForegroundColor White
    Write-Host "3. Copie e cole na pasta:" -ForegroundColor White
    Write-Host "   $destinoGSAP" -ForegroundColor Cyan
    Write-Host ""
    
    $pastaManual = Read-Host "🔍 Digite o caminho da pasta com seus plugins (ou ENTER para pular)"
    
    if ($pastaManual -and (Test-Path $pastaManual)) {
        Write-Host ""
        Write-Host "📂 COPIANDO DE: $pastaManual" -ForegroundColor Yellow
        
        $arquivosJS = Get-ChildItem -Path "$pastaManual\*.js"
        $copiados = 0
        
        foreach ($arquivo in $arquivosJS) {
            try {
                Copy-Item $arquivo.FullName -Destination $destinoGSAP -Force
                Write-Host "✅ $($arquivo.Name)" -ForegroundColor Green
                $copiados++
            } catch {
                Write-Host "❌ Erro ao copiar: $($arquivo.Name)" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "🎉 SUCESSO! $copiados arquivos copiados!" -ForegroundColor Green
    }
}

# Verificar arquivos copiados
Write-Host ""
Write-Host "🔍 VERIFICANDO ARQUIVOS COPIADOS:" -ForegroundColor Cyan
$arquivosDestino = Get-ChildItem -Path $destinoGSAP -Filter "*.js"

if ($arquivosDestino.Count -gt 0) {
    foreach ($arquivo in $arquivosDestino) {
        $tamanho = [math]::Round($arquivo.Length / 1KB, 1)
        Write-Host "📄 $($arquivo.Name) - ${tamanho}KB" -ForegroundColor White
    }
} else {
    Write-Host "❌ Nenhum arquivo encontrado!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 PLUGINS NECESSÁRIOS PARA FUNCIONALIDADE COMPLETA:" -ForegroundColor Yellow
Write-Host "✅ gsap.min.js (obrigatório)" -ForegroundColor White
Write-Host "✅ ScrollTrigger.min.js (gratuito)" -ForegroundColor White
Write-Host "💎 MorphSVG.min.js (premium)" -ForegroundColor Magenta
Write-Host "💎 DrawSVG.min.js (premium)" -ForegroundColor Magenta
Write-Host "💎 SplitText.min.js (premium)" -ForegroundColor Magenta
Write-Host "💎 ScrollSmoother.min.js (premium)" -ForegroundColor Magenta
Write-Host "💎 CustomEase.min.js (premium)" -ForegroundColor Magenta
Write-Host "💎 Physics2D.min.js (premium)" -ForegroundColor Magenta

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Green
Write-Host "1. Execute o teste local: .\infrastructure\dev-start.ps1" -ForegroundColor White
Write-Host "2. Abra http://localhost:3000" -ForegroundColor White  
Write-Host "3. Pressione F12 -> Console para ver verificação dos plugins" -ForegroundColor White
Write-Host "4. Se tudo estiver OK, faça o deploy: .\infrastructure\deploy.sh" -ForegroundColor White

Write-Host ""
Write-Host "🎬 QUANDO OS PLUGINS ESTIVEREM FUNCIONANDO:" -ForegroundColor Yellow
Write-Host "- Loading screen com animações épicas" -ForegroundColor White
Write-Host "- Texto aparecendo letra por letra" -ForegroundColor White
Write-Host "- Scroll suave como manteiga" -ForegroundColor White
Write-Host "- Partículas flutuantes realistas" -ForegroundColor White
Write-Host "- Formas SVG se transformando" -ForegroundColor White

Write-Host ""
Write-Host "✨ Pronto para impressionar no NASA Space Apps Challenge 2025!" -ForegroundColor Green

# Pausa para o usuário ler
Write-Host ""
Read-Host "Pressione ENTER para continuar..."

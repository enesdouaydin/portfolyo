#!/bin/sh
# Playwright konteyneri içinde çalışır: sayfaları çeker, tasarımla karşılaştırır, metinleri doğrular.
# Kullanım: sh verify-all.sh [sayfa ...]   (sayfa: home bayi sesli kdv ev; boşsa hepsi)
set -e
PAGES="${*:-home bayi sesli kdv ev}"
for p in $PAGES; do
  case $p in
    home)  route=/;                       src=Main;         shot=Main;         extra="--scrolls 0.14,0.5,1" ;;
    bayi)  route=/projeler/bayi-rota;     src=Project;      shot=Project;      extra="--scrolls 0.3,0.6,1 --clicks Canlı\ demo,Algoritma" ;;
    sesli) route=/projeler/sesli-asistan; src=SesliAsistan; shot=SesliAsistan; extra="--scrolls 0.2,0.35,0.5,0.7,0.85,1" ;;
    kdv)   route=/projeler/kdv-iade;      src=KdvIade;      shot=KdvIade;      extra="--scrolls 0.2,0.4,0.55,0.75,1" ;;
    ev)    route=/projeler/ev-fiyat;      src=EvFiyat;      shot=EvFiyat;      extra="--scrolls 0.2,0.45,0.7,1" ;;
  esac
  echo "=================== $p"
  eval node shot.mjs $route $p --design /design/tasarim/$src.dc.html $extra
  node compare.mjs /design/ekran-goruntuleri/$shot-tam-sayfa.jpg out/shots/$p-tam-sayfa.png out/shots/$p-tam 1800
done

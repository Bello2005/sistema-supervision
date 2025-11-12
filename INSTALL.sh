#!/bin/bash

# ============================================
# Sistema de Supervisión - Script de Instalación
# RES N° 215 DE 2025
# RESGUARDO INDÍGENA CATRÚ, DUBASA Y ANCOSÓ
# ============================================

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║  🚀 SISTEMA DE SUPERVISIÓN - INSTALACIÓN AUTOMÁTICA     ║"
echo "║  RES N° 215 DE 2025                                     ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Detectar método de instalación
echo "Selecciona el método de instalación:"
echo ""
echo "1) Docker (Recomendado - Más rápido)"
echo "2) Instalación Local (Node.js + PostgreSQL)"
echo "3) Solo Backend"
echo "4) Solo Frontend"
echo ""
read -p "Opción [1-4]: " option

case $option in
  1)
    echo ""
    echo "🐳 Instalación con Docker..."
    echo ""

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker no está instalado. Instálalo desde: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose no está instalado. Instálalo desde: https://docs.docker.com/compose/install/"
        exit 1
    fi

    echo "✅ Docker detectado"

    # Crear .env para backend
    if [ ! -f backend/.env ]; then
        echo "📝 Creando archivo .env..."
        cp backend/.env.example backend/.env
        echo "✅ Archivo .env creado"
    fi

    # Levantar servicios
    echo "🚀 Levantando servicios con Docker Compose..."
    docker-compose up -d

    echo "⏳ Esperando a que los servicios estén listos..."
    sleep 10

    # Ejecutar migraciones
    echo "📊 Ejecutando migraciones de base de datos..."
    docker-compose exec -T backend npm run migrate

    # Ejecutar seeds
    echo "🌱 Cargando datos de ejemplo..."
    docker-compose exec -T backend npm run seed

    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ✅ INSTALACIÓN COMPLETADA CON ÉXITO                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 URLs disponibles:"
    echo "  - Frontend: http://localhost:8080"
    echo "  - Backend API: http://localhost:3000"
    echo "  - PostgreSQL: localhost:5432"
    echo ""
    echo "🔑 Credenciales de prueba:"
    echo "  - Email: admin@supervision.com"
    echo "  - Password: password123"
    echo ""
    echo "📝 Comandos útiles:"
    echo "  - Ver logs: docker-compose logs -f"
    echo "  - Detener: docker-compose down"
    echo "  - Reiniciar: docker-compose restart"
    echo ""
    ;;

  2)
    echo ""
    echo "🛠️  Instalación Local..."
    echo ""

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no está instalado. Descárgalo desde: https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js versión 18 o superior requerida. Tu versión: $(node -v)"
        exit 1
    fi

    echo "✅ Node.js $(node -v) detectado"

    # Verificar PostgreSQL
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL no está instalado. Descárgalo desde: https://www.postgresql.org/download/"
        exit 1
    fi

    echo "✅ PostgreSQL detectado"

    # Instalar dependencias del backend
    echo "📦 Instalando dependencias del backend..."
    cd backend
    npm install

    # Crear .env
    if [ ! -f .env ]; then
        echo "📝 Creando archivo .env..."
        cp .env.example .env
        echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales de PostgreSQL"
        read -p "Presiona Enter para continuar después de editar .env..."
    fi

    # Crear base de datos
    echo "🗄️  Creando base de datos..."
    DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2)
    createdb $DB_NAME 2>/dev/null || echo "Base de datos ya existe o error al crear"

    # Ejecutar migraciones
    echo "📊 Ejecutando migraciones..."
    npm run migrate

    # Ejecutar seeds
    echo "🌱 Cargando datos de ejemplo..."
    npm run seed

    # Iniciar backend
    echo "🚀 Iniciando servidor backend..."
    npm run dev &
    BACKEND_PID=$!

    cd ..

    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  ✅ INSTALACIÓN COMPLETADA CON ÉXITO                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Backend corriendo en: http://localhost:3000"
    echo ""
    echo "📝 Para iniciar el frontend:"
    echo "  cd frontend"
    echo "  python -m http.server 8080"
    echo "  # O"
    echo "  npx http-server -p 8080"
    echo ""
    echo "🔑 Credenciales de prueba:"
    echo "  - Email: admin@supervision.com"
    echo "  - Password: password123"
    echo ""
    ;;

  3)
    echo ""
    echo "🔧 Instalando solo Backend..."
    echo ""

    cd backend

    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no está instalado"
        exit 1
    fi

    npm install

    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️  Edita backend/.env con tus credenciales"
    fi

    npm run migrate
    npm run seed
    npm run dev

    ;;

  4)
    echo ""
    echo "🎨 Instalando solo Frontend..."
    echo ""

    cd frontend

    echo "Selecciona servidor HTTP:"
    echo "1) Python"
    echo "2) Node.js (http-server)"
    echo "3) PHP"
    read -p "Opción [1-3]: " server_option

    case $server_option in
      1)
        python -m http.server 8080
        ;;
      2)
        npx http-server -p 8080
        ;;
      3)
        php -S localhost:8080
        ;;
    esac
    ;;

  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac

exit 0

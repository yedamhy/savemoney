#!/bin/bash

# 소스 코드 업데이트
git pull origin main

# 필요한 경우, 종속성 설치 및 빌드
# 예: Node.js 프로젝트의 경우
npm install
npm run build

# 애플리케이션 실행
# 예: Node.js 애플리케이션의 경우
npm start

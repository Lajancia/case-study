pipeline {
    agent any

    environment {
        GHCR_IMAGE = 'ghcr.io/g3941813-svg/case-study'
        CONTAINER_NAME = 'soomin-case-studies'
        COMPOSE_DIR = '/root/case-study'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def shortCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    echo "Building image: ${GHCR_IMAGE}:${shortCommit}"
                    sh "docker build \\"
                        + " --build-arg NEXT_PUBLIC_SITE_URL=https://soominlab.com \\"
                        + " -t ${GHCR_IMAGE}:${shortCommit} ."
                    sh "docker tag ${GHCR_IMAGE}:${shortCommit} ${GHCR_IMAGE}:latest"
                    sh "docker push ${GHCR_IMAGE}:${shortCommit}"
                    sh "docker push ${GHCR_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Host') {
            steps {
                script {
                    sh "chmod +x scripts/deploy.sh && ./scripts/deploy.sh ${GHCR_IMAGE}:latest"
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f || true'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed! Case study deployed to soominlab.com"
        }
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs for details.'
        }
    }
}
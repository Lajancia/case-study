pipeline {
    agent any

    environment {
        GHCR_IMAGE = 'ghcr.io/g3941813-svg/case-study'
        GITOPS_REPO = 'https://github.com/g3941813-svg/case-study-ops.git'
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
                    sh "docker build --build-arg NEXT_PUBLIC_SITE_URL=https://soominlab.com -t ${GHCR_IMAGE}:${shortCommit} ."
                    sh "docker tag ${GHCR_IMAGE}:${shortCommit} ${GHCR_IMAGE}:latest"
                    sh "docker push ${GHCR_IMAGE}:${shortCommit}"
                    sh "docker push ${GHCR_IMAGE}:latest"
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                script {
                    def shortCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    sh """
                        export GIT_TERMINAL_PROMPT=0
                        rm -rf gitops-tmp
                        git clone ${GITOPS_REPO} gitops-tmp
                        cd gitops-tmp
                        sed -i 's|image: ghcr.io/g3941813-svg/case-study:.*|image: ${GHCR_IMAGE}:${shortCommit}|' case-study.yaml
                        git config user.name "Jenkins CI"
                        git config user.email "ci@soominlab.com"
                        git add case-study.yaml
                        git commit -m "chore: update case-study image tag to ${shortCommit}"
                        git push
                        cd .. && rm -rf gitops-tmp
                    """
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
            echo '✅ Pipeline completed! Image pushed to GHCR and GitOps repo updated — ArgoCD will auto-sync.'
        }
        failure {
            echo '❌ Pipeline failed. Check Jenkins logs for details.'
        }
    }
}
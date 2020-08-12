node {
  try {
    stage("Checkout") {
        checkout scm
    }
    
    stage("Environment") {
      sh "git --version"
      echo "Branch: ${env.BRANCH_NAME}"
      sh "docker -v"
      sh "printenv"
    }

    stage("Build frontend tests") {
      sh "docker build -f Dockerfile-test -t k64/frontend-test --no-cache ."
    }
    stage("Run frontend tests"){
      sh "docker run --rm k64/frontend-test"
    }
    stage("Delete frontend tests") {
      sh "docker rmi k64/frontend-test"
    }
    stage("Deploy frontend") {
      sh "docker build -t k64-playground-frontend --no-cache ."
      sh "docker tag k64-playground-frontend:latest rberton/k64-playground-frontend:latest"
      withCredentials([usernamePassword( credentialsId: "Dockerhub", usernameVariable: "USERNAME", passwordVariable: "PASSWORD")]) {
        sh "docker login -u ${USERNAME} -p ${PASSWORD}"
        sh "docker push rberton/k64-playground-frontend:latest"
      }
      sh "docker rmi k64-playground-frontend"
    }
  }
  catch (err) {
    throw err
  }
}
npm run build
git add .
git commit -m 'deploy'
git push
ansible-playbook -i registry-webserver, deploy_digital_ocean.yml
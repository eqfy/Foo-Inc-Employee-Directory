
#!/bin/bash
POOL=$(aws cognito-idp list-user-pools --max-results 1 | awk '/Id/ {print $2}' | tr -d , | sed -e 's/^"//' -e 's/"$//')
aws cognito-idp admin-create-user --user-pool-id ${POOL} --username $1
aws cognito-idp admin-set-user-password --user-pool-id ${POOL} --username $1 --password $2 --permanent
echo "Remember Your Username: $1 and Password: $2"
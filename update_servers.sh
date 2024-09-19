#!/usr/bin/bash
# This script is used to update servers with the latest files and folders for a backend application.
# It connects to two servers specified by their IP addresses and sends the files to the '~/backend/' directory on each server.
# The script also provides options to clear backups and create a backup of the current backend.
# The script requires the following dependencies: bash, ssh, scp, zip.

# Usage:
#   ./updates_servers.sh [options] [files/folders]
#
# Options:
#   -y    Skip warning message and continue without confirmation
#   -Y    Skip warning message and continue without confirmation
#   -B    Skip creating a backup of the current backend
#   -c    Clear backups on the servers before creating a new backup

# Example:
#   ./updates_servers.sh -y -B file1.txt folder2 -c

# Note:
#   - The files/folders passed as arguments will be sent to the '~/backend/' directory on the servers.
#   - The file/folder path will be maintained.
#   - If the -c flag is passed, the script will prompt for confirmation before clearing backups on the servers.
#   - If the -B flag is not passed, the script will create a backup of the current backend on both servers.
#   - The script uses the 'zip' command to create backups and the 'scp' command to send files to the servers.
#   - The script assumes that the servers are accessible via SSH and have the necessary permissions for file operations.
#   - The script assumes that the 'gunicorn' service is running on the servers and can be restarted using the 'sudo service gunicorn restart' command.

server1="ubuntu@100.25.156.109"
server2="ubuntu@54.146.90.8"

remote_path="backend/"
backups_path="/home/ubuntu/backups/"

flags="yYBc"
current_dir=$(pwd)

# skip message if -y flag
if [[ ! "$@" =~ -[yY] ]]; then
    echo "Warning!
    1. The files/folders are to be sent to '~/backend/' in the servers
    2. The file/folder path shall be maintained"

    read -p "Press Y/y to continue else quit: " selection
    if [[ $selection != [Yy] ]]; then
        exit 0
    fi
fi

# check if files/folders passed
if [ $# -le 0 ]; then
    echo "No file/folder passed"
    exit 1
fi

files=""
# ensure files/folders exist
for item in "$@"
do
    # skip flags
    if [[ "$item" == -[$flags] ]]; then
        continue
    fi
    if [[ ! -e $item ]]; then
        echo "file/folder $item does not exist"
        exit 1
    else
        # add to files to send
        # files+=" ${current_dir}/${item}"
        files+=" ${item}"
    fi
done

# echo "Files: $files"
current_date_time=$(date +"%Y-%m-%dT%H%M%S")

# remove backups if flag -c is passed
if [[ "$@" =~ -c ]]; then
    read -p "Clear backups? " response
    if [[ $response == [yY] ]]; then
        for server in "$server1" "$server2"
        do
            # check if files exist
            files=$(ssh "$server" "ls $backups_path | wc -l")
            if [[ $files == "0" ]]; then
                echo "No files present at '${server}:${backups_path}'"
                continue
            else
                # if they exist, clear them
                ssh "$server" -t rm -f "${backups_path}*"
            fi
        done
    else
        echo "$backups_path not cleared"
    fi
    if [ -z $files ]; then
        exit 0
    fi
fi

# Backup backend if flag -B is not passed
if [[ ! "$@" =~ -B ]]; then
    command="zip -r ${backups_path}backend_${current_date_time}.zip backend"
    ssh "$server1" "$command"
    ssh "$server2" "$command"
fi

# Send the files
scp -r $files "$server1:$remote_path"
scp -r $files "$server2:$remote_path"

# Restart the gunicorn service
ssh "$server1" "sudo service gunicorn restart"
ssh "$server2" "sudo service gunicorn restart"

sass_pids=$(ps -ef | grep "sass" | grep -v "grep" | grep -v "build_sass" | awk '{print $2}')
for sass_pid in ${sass_pids}; do
    echo "Sass: kill remained sass process [${sass_pid}]..."
    kill $sass_pid
done

scss_files=$(find . -name '*.scss' -not -path '*/VENV/*' -not -path '*/node_modules/*')
for scss_file in ${scss_files}; do
    if [[ $(basename $scss_file) != _* ]]; then
        css_file=$(echo "$scss_file" | sed 's/.scss/.css/')
        npx sass $scss_file $css_file --watch &
    fi
done

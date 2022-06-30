document.getElementById('id_avatar').onchange = (e) => {
    let files = e.target.files 
    let fr = new FileReader();
    if (files.length > 0) {
        document.getElementById('id_avatarNote').innerHTML = "图片已选择～"
    }
    fr.onload = () => {
        document.getElementById("avatarDisplay").src = fr.result;
    }
    fr.readAsDataURL(files[0]);
}

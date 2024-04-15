async function logMovies() {
    const response = await fetch("/all-characters");
    const characters = await response.json();
    console.log(characters);

    characters.forEach((character)=>{
        console.log(character.id)
        console.log(character.characterName)


        const para = document.createElement("a");
        para.href = "/avatar/" + character.id
        const node = document.createTextNode(character.characterName);
        para.appendChild(node);
        const element = document.getElementById("div1");
        element.appendChild(para);

    })



}

logMovies()
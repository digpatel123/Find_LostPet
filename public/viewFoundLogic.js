let wrapper = document.getElementById("view-container")


fetch("/all").then(function(response){
    return response.json()
}).then(function(data){

    
    for(let i = 0; i<data.length; i++){

        // Parent Div
        let newDiv = document.createElement("div")
        newDiv.setAttribute("id","pet-container-display")

        let petHeaderDiv = document.createElement("div")
        petHeaderDiv.setAttribute("id","pet-header")
        let petHeader = document.createElement("h1")
        petHeader.textContent ="Pet Information"

        petHeaderDiv.appendChild(petHeader)

        // Child div to be appended to parent div
        let petDiv = document.createElement("div")
        petDiv.setAttribute("id","pet-info")

        

        // Creating PetInfo Div
        let petInfo = document.createElement("div")
        petInfo.setAttribute("id","pet-ntcd")

        // Adding content to pet info div

        let petName = document.createElement("h3")
        petName.textContent = `Pet Name : `
        let nameSpan = document.createElement("span")
        nameSpan.textContent = `${data[i].pet_name}`
        nameSpan.id = "data-span"
        petName.appendChild(nameSpan)


        let petType = document.createElement("h3")
        petType.textContent = `Pet Type : `
        let typeSpan = document.createElement("span")
        typeSpan.textContent = `${data[i].pet_type}`
        typeSpan.id = "data-span"
        petType.appendChild(typeSpan)



        let petColor = document.createElement("h3")
        petColor.textContent = `Pet Color : `
        let colorSpan = document.createElement("span")
        colorSpan.textContent = `${data[i].pet_color}`
        colorSpan.id = `data-span`
        petColor.appendChild(colorSpan)

        let petDescription = document.createElement("h3")
        petDescription.textContent = `Pet Description : `
        let descriptionSpan = document.createElement("span")
        descriptionSpan.textContent = `${data[i].pet_description}`
        descriptionSpan.id = "data-span"
        petDescription.appendChild(descriptionSpan)


        // Appending to pet Info
    
        petInfo.appendChild(petName)
        petInfo.appendChild(petType)
        petInfo.appendChild(petColor)
        petInfo.appendChild(petDescription)

        newDiv.appendChild(petHeaderDiv)
        newDiv.appendChild(petDiv)
        
        wrapper.appendChild(newDiv)



    }

})
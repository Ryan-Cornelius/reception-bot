// Format of people array as below:
//[
//    {
//        name: 'name',
//        email: 'name@email.com',
//        businesses: ['business1', 'business2', 'business3']
//    }

function showPersonList(business){
    $('#personList > li').remove();
    $('#personContainer')
        .css('display', 'flex');
    let relatedPeople = filterByBusiness(business);
    addPeopleToList(relatedPeople);
}

function filterByBusiness(business) {
    let relatedPeople = [];
    for(let i = 0; i < people.length; i++) {
        if(people[i].businesses.indexOf(business) !== -1){
            relatedPeople.push(people[i]);
        }
    }
    return relatedPeople;
}

function addPeopleToList(peopleToAdd) {
    for(let i = 0; i < peopleToAdd.length; i++) {
        $('#personList').append(
            listItemConstuctor(peopleToAdd[i].name)
        );
    };
};

function listItemConstuctor(name) {
    return (
        `<li class="list-group-item">${name}</li>`
    );
};

function handleSinglePersonError() {
    if($('#personList > .active').length > 1){
        toastr.error('Please select one person only.')
    }
}

function showFormContainer() {
    $('#formContainer')
        .css('display', 'flex');
    scrollTo('#formContainer');
}

function scrollTo(id) {
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 1000)
}

function handleSubmit() {

    if($('#nameInput').val() !== '') {
        let visitorName = $('#nameInput').val();
        let requestedPerson = $('#personList > li.active')[0].innerText;
        let requestedPersonObj = {};
    
        for (let i = 0; i < people.length; i++){
            if (people[i].name === requestedPerson) {
                requestedPersonObj = people[i];
            }
        }
        sendEmail(visitorName, requestedPersonObj.name, requestedPersonObj.email);
    } else {
        toastr.error('Please enter your name');
    }
}

function sendEmail(vName, tName, tEmail) {
    emailjs.send(
        config.USERNAME,
        config.TEMPLATE_NUMBER,
        {visitorName: vName,
        toName: tName,
        toEmail: tEmail}
    ).then((response) => {
        toastr.success('Notification sent!');
        return;
    }).catch((error) => {
        toastr.error('Something went wrong... please speak to a human.');
    });
}

$(document).ready( () => {
    $('.business').click((e) => {
        showPersonList(e.target.innerText);
        scrollTo('#personContainer')
    });

    $('#duncanCotterill').click((e) => {
        $('#directions')
            .css('display', 'flex');
        scrollTo('#directions')
    })

    $('#personList').on('click', '.list-group-item', (e) => {
        $(e.target).toggleClass('active');
        handleSinglePersonError();
        showFormContainer();
    });

    $('#formContainer').on('click', '#submitBtn', (e) => {
        handleSubmit()
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    });
});
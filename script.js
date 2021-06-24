

/******************************
********QUIZ CONTROLLER*******
******************************/
let quizController = (function(){

    /*************Question Constructor************/
    function Question(id, questionText, options, correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    let questionLocalStorage = {
        setQuestionCollection: function (newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function(){
            localStorage.removeItem('questionCollection');
        }
    };

    if(questionLocalStorage.getQuestionCollection() === null){
        questionLocalStorage.setQuestionCollection([]);
    }

    let quizProgress = {
        questionIndex: 0
    };

    //***********PERSON CONSTRUCTOR***********/
    function Person(id, firstname, lastname, score){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    let currPersonData = {
        fullname: [],
        score: 0
    };

    let adminFullName = ['Admin', 'Kloud'];

    let personLocalStorage = {
        setPersonData: (newPersonData) =>{
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: () =>{
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: () =>{
            localStorage.removeItem('personData');
        }
    };

    if(personLocalStorage.getPersonData() === null){
        personLocalStorage.setPersonData([]);
    }



    return{

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestionText, opts){
            let optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
                if(questionLocalStorage.getQuestionCollection() === null){
                    questionLocalStorage.setQuestionCollection([]);
                }
            optionsArr = [];

                isChecked = false;

            for(let i = 0; i < opts.length; i++){
                if(opts[i].value !== ""){
                    optionsArr.push(opts[i].value);
                }

                if(opts[i].previousElementSibling.checked && opts[i].value !== ""){
                    corrAns = opts[i].value;
                    isChecked = true;
                     
                }
            }

            if(questionLocalStorage.getQuestionCollection().length > 0){
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            }else{
                questionId = 0;
            }
            if(newQuestionText.value !== ""){
                if(optionsArr.length > 1){
                    if(isChecked){
            

                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestionText.value = "";

                        for(let x = 0; x < opts.length; x++){
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                        // console.log(questionLocalStorage.getQuestionCollection());

                        return true;

                    }else{
                        alert('You missed to check correct answer or you checked the answer without value.');
                        return false;
                    }
                }else{
                    alert("You must insert at least 2 options");
                    return false;
                }
            } else {
                alert("Please, Insert Question");
                return false;
            }

        },

        checkAnswer: (Ans) =>{

            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === Ans.textContent){

                currPersonData.score++;

                return true;

            }else{

                return false;

            }

        }, 

        isFinished: () =>{

            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;

        },

        addPerson: () =>{
            let newPerson, personId, personData;

            if(personLocalStorage.getPersonData().length > 0){

                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;

            } else {

               personId = 0;

            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);

            console.log(newPerson);

        },

        getCurrPersonData: currPersonData,

        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage


    };

})();

/******************************
********UI CONTROLLER*******
******************************/
let UIController = (function(){

    let domitems = {
        //************Admin panel Elements**************
        adminPanelSection: document.querySelector(".admin-container"),
        questionInsertBtn: document.getElementById("insert-btn"),
        newQuestionText: document.getElementById("newQuestion"),
        adminOptions: document.querySelectorAll(".opt"),
        adminOptionsContainer: document.querySelector(".option-container"),
        insertedQuestionWrapper: document.querySelector(".qDisplay"),
        queUptateBtn: document.getElementById("update-btn"),
        queDeleteBtn: document.getElementById("delete-btn"),
        questionClearBtn: document.getElementById("clrList-btn"),
        resultsListWrapper: document.querySelector(".rDisplay"),
        clearResultsBtn: document.getElementById("clrResults-btn"),
        // **********Quiz Section ELements***************
        quizSection: document.querySelector(".container3"),
        askedQuestionText: document.getElementById("ques"),
        quizOptionsWrapper: document.querySelector(".answerOptions"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress"),
        instAnsContainer: document.querySelector(".instant-answer"),
        instAnswerText: document.getElementById("instant-answer-text"),
        nextQuestionbtn: document.getElementById("next-question-btn"),
        //**************** */Landing Page Elements**************
        LandPageSection: document.querySelector(".container2"),
        startQuizBtn: document.getElementById("startQuiz-btn"),
        firstNameInput: document.getElementById("firstName"),
        lastNameInput: document.getElementById("lastName"),
        //**************Final Result Section Elements********/
        finalResultSection: document.querySelector(".container4"),
        finalScoreText: document.getElementById("finalScore")
            


    };

    return {
        getDomItems: domitems,

        addInputsDynamically: () => {

            let addInput = () => {
                let inputHTML, z;

                z = document.querySelectorAll('.opt').lenngth;

                inputHTML = '<div class="option-wrapper"><input type="radio" name="addAnswer" class="opt' + z +'" value="'+ z + '"><input type="text" placeholder="Add Answer." class="opt opt'+ z + '" value=""></div>';

                domitems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domitems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                
                domitems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

                
            }
            
            domitems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
           

        },

        createQuestionList: (getQuestions) => {

            let questionHTML, numberingArr;

            numberingArr = [];

            domitems.insertedQuestionWrapper.innerHTML = "";

            for(let i = 0; i < getQuestions.getQuestionCollection().length; i++){

                numberingArr.push(i+1);

                questionHTML = '<div class="edit-div"><p class="edit-question">'+ numberingArr[i] +'. '+ getQuestions.getQuestionCollection()[i].questionText +'</p><button class="edit-btn edit-btn" id="editQuestionBtn-'+ getQuestions.getQuestionCollection()[i].id +'">Edit</button></div><br><br>';

                domitems.insertedQuestionWrapper.insertAdjacentHTML('beforeend', questionHTML);

                

            }

        },

        editQuestionList: (event, storageQuestionList, addInpsDynFn, updateQuestionListFn) => {

            let getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

            if("editQuestionBtn-".indexOf(event.target.id)){

                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestionList = storageQuestionList.getQuestionCollection();

                for(let i = 0; i < getStorageQuestionList.length; i++){

                    if(getStorageQuestionList[i].id === getId){

                        foundItem = getStorageQuestionList[i];

                        placeInArr = i;

                    }

                }

                domitems.newQuestionText.value = foundItem.questionText;

                domitems.adminOptionsContainer.innerHTML = '';

                optionHTML = '';

                for(let x = 0; x < foundItem.options.length; x++){

                    optionHTML += '<div class="option-wrapper"><input type="radio" name="addAnswer" class="opt'+ x +'" value="'+ x +'"><input type="text" placeholder="Add Answer." class="opt opt'+ x +'" value="'+ foundItem.options[x] +'"></div>';

                }

                domitems.adminOptionsContainer.innerHTML = optionHTML;

                domitems.queUptateBtn.style.visibility = 'visible';
                domitems.queDeleteBtn.style.visibility = 'visible';
                domitems.questionInsertBtn.style.visibility = 'hidden';
                domitems.questionClearBtn.style.cursor = 'no-drop';
                // domitems.questionClearBtn.setAttribute('id', 'clrList-btn clrList-btn-null');

                addInpsDynFn();

                let backDefaultView = () =>{

                    let updatedOptions;
                    
                    domitems.newQuestionText.value = "";                    
                    updatedOptions = document.querySelectorAll(".opt");

                    for(let i = 0; i < updatedOptions.length; i++){

                        updatedOptions[i].value = "";
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domitems.queUptateBtn.style.visibility = 'hidden';
                    domitems.queDeleteBtn.style.visibility = 'hidden';
                    domitems.questionInsertBtn.style.visibility = 'visible';
                    domitems.questionClearBtn.style.cursor = 'pointer';

                    updateQuestionListFn(storageQuestionList);

                }

                let updateQuestion = () => {
                    let newOptions, optionEls;

                    newOptions = [];

                    optionEls =  document.querySelectorAll(".opt");

                    foundItem.questionText = domitems.newQuestionText.value;

                    foundItem.correctAnswer = '';

                    for(let i = 0; i < optionEls.length; i++){

                        if(optionEls[i].value !== ''){
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked){
                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }

                    }

                    foundItem.options = newOptions;

                    if(foundItem.questionText !== ''){

                        if(foundItem.options.length > 1){

                            if(foundItem.correctAnswer !== ''){


                                getStorageQuestionList.splice(placeInArr, 1, foundItem);

                                storageQuestionList.setQuestionCollection(getStorageQuestionList);
                                
                                backDefaultView();

                            }else{
                                alert('You missed the correct answer, or you checked answer without value');
                            }
                        }else{
                            alert('You must insert at lease two options');
                        }
                    } else {
                        alert('Please, Insert Question');
                    }

                }

                domitems.queUptateBtn.onclick = updateQuestion;

                let deleteQuestion = () =>{
                    
                    getStorageQuestionList.splice(placeInArr, 1);

                    storageQuestionList.setQuestionCollection(getStorageQuestionList);

                    backDefaultView();

                }

                domitems.queDeleteBtn.onclick = deleteQuestion;
                
 
            }


        },

        clearQuestionList: (storageQuestionList) =>{

            if(storageQuestionList.getQuestionCollection() !== null){

                if(storageQuestionList.getQuestionCollection().length > 0){

                    let conf = confirm('Warning: Are you sure you want to clear the list?, You will lose entire question list');

                    if(conf){

                        storageQuestionList.removeQuestionCollection();

                        domitems.insertedQuestionWrapper.innerHTML = '';

                    }

                }
            }

        },

        displayQuestion: (storageQuestionList, progress) =>{
            let newOptHTML, charArr;

            charArr = ['A','B','C','D','E','F'];

            if(storageQuestionList.getQuestionCollection().length > 0){

                domitems.askedQuestionText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;

                domitems.quizOptionsWrapper.innerHTML = '';
                
                for(let i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++){

                    newOptHTML = '<div class="ans'+ i +'"><span class="ans'+ i +'">'+ charArr[i] +'</span><p class="ans'+ i +'">'+ storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i] +'</p></div>';

                    domitems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptHTML);

                }

            }

        },

        displayProgress: (storageQuestionList, progress) =>{

            domitems.progressBar.max = storageQuestionList.getQuestionCollection().length;

            domitems.progressBar.value = progress.questionIndex + 1;

            domitems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length;

        },

        newDesign: (AnsResult, selectedAnswer) =>{
            let twoOptions, index;

            index = 0;

            if(AnsResult){
                index = 1;
            }

            twoOptions = {
                instAnsText: ['Wrong', 'Correct'],
                instAnsClass: ['instant-answer red', 'instant-answer green'],
                optionsSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            };

            domitems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";

            domitems.instAnsContainer.style.opacity = "1";

            domitems.instAnswerText.textContent = twoOptions.instAnsText[index];

            domitems.instAnsContainer.className = twoOptions.instAnsClass[index];

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsSpanBg[index];

        },

        resetDesign: () =>{

            domitems.quizOptionsWrapper.style.cssText = "";

            domitems.instAnsContainer.style.opacity = "0";

        },

        getFullName: (currPerson, storageQuestList, admin) =>{

            if(domitems.firstNameInput.value !== "" && domitems.lastNameInput.value !== ""){

                if(!(domitems.firstNameInput.value === admin[0] && domitems.lastNameInput.value === admin[1])){

                    if(storageQuestList.getQuestionCollection().length > 0){

                        currPerson.fullname.push(domitems.firstNameInput.value);

                        currPerson.fullname.push(domitems.lastNameInput.value);

                        domitems.LandPageSection.style.display = 'none';

                        domitems.quizSection.style.display = 'block';

                        console.log(currPerson);
                    }else{

                        alert('Quiz is not ready, please contact the administrator');

                    }

                }else {

                    domitems.LandPageSection.style.display = 'none';

                    domitems.adminPanelSection.style.display = 'block';

                }

            }else {

                alert('Please, Enter Your First Name and Last Name');

            }

        },

        finalResult: (currPerson) =>{

            domitems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domitems.quizSection.style.display = 'none';

            domitems.finalResultSection.style.display = 'block';

        },

        addResultOnPanel: (userData) =>{

            let resultHTML;

            domitems.resultsListWrapper.innerHTML = '';

            for(let i = 0; i < userData.getPersonData().length; i++){

                resultHTML = '<div class="rDis"><p class="person person'+ i +'"><span class="per person'+ i +'">' + userData.getPersonData()[i].firstname + '  ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' points</span><button class="delResults-btn" id="delResults-btn_'+ userData.getPersonData()[i].id +'" class="delResults-btn">delete</button></p></div>';

                domitems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);

            }

        },

        deleteResults: (event, userData) =>{
            let getId, personArr;

            personArr = userData.getPersonData();

            if('delete-result-btn_'.indexOf(event.target.id)){

                getId = parseInt(event.target.id.split('_')[1]);

                for(let i = 0; i < personArr.length; i++){

                    if(personArr[i].id === getId){
                        
                        personArr.splice(i, 1);

                        userData.setPersonData(personArr);

                    }

                }

            }


        },

        clearResultList: (userData) =>{

            let conf;

            if(userData.getPersonData() !== null){

                if(userData.getPersonData().length > 0){

                    conf = confirm('Warning: You will lose entire result list');

                    if(conf){

                        userData.removePersonData();

                        // domitems.resultsListWrapper.style.backgroundColor = null;
                        domitems.resultsListWrapper.innerHTML = '';

                    }

                }
            }

        }

    };



})();


/******************************
***********CONTROLLER**********
******************************/
let controller = (function(quizCtrl, UICtrl){

    let selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function(){

        let adminOptions = document.querySelectorAll('.opt');
        
        let checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if(checkBoolean){

            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

        }

    });    

    selectedDomItems.insertedQuestionWrapper.addEventListener('click', (e) => {

        UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);

    });

    selectedDomItems.questionClearBtn.addEventListener('click', () =>{

        UICtrl.clearQuestionList(quizController.getQuestionLocalStorage);

    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', (e) =>{

        let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for(let i = 0; i < updatedOptionsDiv.length; i++){

            if(e.target.className === 'ans' + i){
                
                let answer = document.querySelector('.answerOptions div p.' + e.target.className);

                let answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if(quizCtrl.isFinished()){

                    selectedDomItems.nextQuestionbtn.textContent = 'Finish';

                }

                let nextQuestion = (questionData, progress) =>{

                    if(quizCtrl.isFinished()){

                        // Finish Quiz
                        quizCtrl.addPerson();
                        
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);

                    }else{

                        UICtrl.resetDesign();

                        quizCtrl.getQuizProgress.questionIndex++;

                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        
                    }

                }

                selectedDomItems.nextQuestionbtn.onclick = () =>{
                    
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                }

            }

        }

    });

    selectedDomItems.startQuizBtn.addEventListener('click', () =>{

        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);


    });

    selectedDomItems.lastNameInput.addEventListener('focus', () =>{

        selectedDomItems.lastNameInput.addEventListener('keypress', (e) =>{

            if(e.keyCode === 13){

                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);


            }

        });

    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItems.resultsListWrapper.addEventListener('click', (e) =>{

        UICtrl.deleteResults(e, quizCtrl.getPersonLocalStorage);

        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    });

    selectedDomItems.clearResultsBtn.addEventListener('click', () =>{

        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);

    });

})(quizController, UIController);


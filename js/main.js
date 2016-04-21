//Task
//
//Score Board
//  add Participant
//      + name
//      + scores
//      + if scores === 100 give Beer than start from 0 again
//
//  give points to participant
//  save how many Beers were given that day
//  
//  [Button - add new participant]
//      [Name input]
//  [Participant Name][Points][Beers][Input + Add points button][delete participant]
// 
 
/**
 * 
 * @requires model.js
 */
(function (GLOBAL){

    //Namespace
    GLOBAL.app = GLOBAL.app || {};


    app.init = function initializeApplication () {

        this.cacheElements();
        this.bindEvents();
    };

    app.uiElements = [];

    /**
     * Selects elements - One Time only
     * @return {Void}
     */
    app.cacheElements = function () {

        this.elements.addParticipantButton = document.getElementById('js-add-participant');
        this.elements.participantNameFlied = document.getElementById('js-participant-name');
        this.elements.participantsList = document.getElementById('js-participants-list');
    };

    /**
     * Binds specific events
     * @return {Void}
     */
    app.bindEvents = function () {
        
        //Bind Add button
        this.elements.addParticipantButton.addEventListener('click', function () {
            var name = app.elements.participantNameFlied.value,
                participant;

            if(name) {
                participant = app.model.addParticipant(name);
                
                app.uiElements.push(new uiParticipant(participant));

                app.elements.participantNameFlied.value = '';
            }
        });
    };

    /**
     
     * @param {Object} participant
     * @return {Void}
     */
    function uiParticipant (participant) {
        this.elements = {};
        this.model = participant;
        this.render();
    }

    uiParticipant.prototype.template = function () {
        this.rootEl = document.createElement('tr');
        this.rootEl.innerHTML = ['<td>' + this.model.name + '</td>',
                                '<td class="js-points-count">' + this.model.scores + '</td>',
                                '<td class="js-beers-count">' + this.model.beers + '</td>',
                                '<td>',
                                    '<input type="number" class="js-points">',
                                    '<button class="js-add">+</button>',
                                    '<button class="js-delete">X</button>',
                                '</td>'].join('');
        
        return this.rootEl;
    };

    /**
     * Output Participant HTML
     * @return {Void}
     */
    uiParticipant.prototype.render = function () {

        app.elements.participantsList.appendChild(this.template());
        this.bindEvents();
    };

    /**
     * Binds Participant specific events
     * @return {Void}
     */
    uiParticipant.prototype.bindEvents = function () {

        this.addPoints = this.addPoints.bind(this);
        this.destroy = this.destroy.bind(this);

        this.elements.scoresCount =  this.rootEl.querySelector('.js-points-count');
        this.elements.beersCount =  this.rootEl.querySelector('.js-beers-count');
        this.elements.input =  this.rootEl.querySelector('.js-points');
        this.elements.addBtn =  this.rootEl.querySelector('.js-add');
        this.elements.deleteBtn =  this.rootEl.querySelector('.js-delete');
        
        this.elements.addBtn.addEventListener('click', this.addPoints);
        this.elements.deleteBtn.addEventListener('click', this.destroy);
    };

    uiParticipant.prototype.addPoints = function () {
        //Get value
        var points = parseInt(this.elements.input.value, 10);
        //Update model
        this.model = app.model.givePoints(this.model.name, points);
        //Update UI
        this.elements.scoresCount.innerText = this.model.scores;
        this.elements.beersCount.innerText = this.model.beers;
    };

    uiParticipant.prototype.destroy = function () {
        var self = this;

        this.elements.addBtn.removeEventListener('click', this.addPoints);
        this.elements.deleteBtn.removeEventListener('click', this.destroy);

        this.rootEl.remove();

        app.uiElements.forEach(function (element, index){

            if(element.model.uid === self.model.uid) {
                app.uiElements.splice(index, 1);
                return false;
            }

        });
    };


    app.elements = {
        addParticipantButton: null,
        participantNameFlied: null,
        participantsList: null,
    };



    app.init();

})(window);


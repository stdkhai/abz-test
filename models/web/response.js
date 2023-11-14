class ResponseBase{
    constructor(){
        this.success = false;        
    }

    ok(){
        this.success = true;
    }

    add_message(message){
        this.message = message;
    }

    /**
     * 
     * @param {string} type request name
     * @param {Array<String>} messages list of messages
     */
    add_fails(type, messages){
        this.fails={};
        this.fails[type]=[];
        messages.forEach(msg => {
            this.fails[type].push(msg);            
        });
    }

    /**
     * On success response only
     * @param {string} type 
     * @param {*} body 
     */
    add_result(type, body){
        this.ok();
        this[type]=body;
    }    
}

module.exports = ResponseBase;
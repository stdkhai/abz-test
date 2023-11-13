class column {
    /**
     * 
     * @param {string} name required; field name
     * @param {string} type required; field type; default `varchar`
     * @param {number} size optonal; default none;
     * @param {string | number | boolean} default_value optional
     * @param {boolean} not_null optional; default `true`
     * @param {boolean} auto_increment optional; default `false`
     */
    constructor(name, type, size, default_value, not_null, auto_increment) {
        this.name = name;
        this.type = type;
        this.not_null = not_null && typeof not_null === 'boolean' ? not_null : true;
        this.size = size && typeof size === 'number' ? size : undefined;
        this.default_value = default_value ? default_value : undefined;
        this.auto_increment = auto_increment && typeof auto_increment === 'boolean' ? auto_increment : false;
    }

    string() {
        return `\`${this.name}\` ${this.type}${this.size ? "(" + this.size + ")" : ""} ${this.default_value ? "DEFAULT '" + mysql.escape(this.default_value) + "'" : ""} ${this.not_null ? "NOT NULL" : ""} ${this.auto_increment ? "AUTO_INCREMENT" : ""}`;
    }
}

module.exports ={
    column,

}
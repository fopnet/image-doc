interface String {
    padStart(maxLength: number, fillString: string): string;
    padEnd(maxLength: number, fillString: string): string;
    interpolate(...params): string;
    encodeUtf8(): string;
    decodeUtf8(): string;
    toBase64(): string;
    toBase64Buffer(): Buffer;
    interpolate(...params): string;
    isUtf8(): boolean;
    encodeUrl(): string;
    decodeUrl(): string;
    isUrlEncoded(): boolean;
}

/**
 * fill the string in the beginning with parameter fillString
 * @param {number} maxLength
 * @param {string} fillString
 * @returns {string}
 */

String.prototype.padStart = function (maxLength, fillString = " ") {
    let str = String(this);
    if (str.length >= maxLength) {
        return str;
    }

    fillString = String(fillString);
    if (fillString.length === 0) {
        fillString = " ";
    }

    let fillLen = maxLength - str.length;
    let timesToRepeat = Math.ceil(fillLen / fillString.length);
    let truncatedStringFiller = fillString.repeat(timesToRepeat).slice(0, fillLen);
    return truncatedStringFiller + str;
};

/**
 * fill the string in the final  with parameter fillString
 * @param {number} maxLength
 * @param {string} fillString
 * @returns {string}
 */

String.prototype.padEnd = function (maxLength, fillString = " ") {
    let str = String(this);
    if (str.length >= maxLength) {
        return str;
    }

    fillString = String(fillString);
    if (fillString.length === 0) {
        fillString = " ";
    }

    let fillLen = maxLength - str.length;
    let timesToRepeat = Math.ceil(fillLen / fillString.length);
    let truncatedStringFiller = fillString.repeat(timesToRepeat).slice(0, fillLen);
    return str + truncatedStringFiller;
};

/** 
 
 const template = 'Example text: ${text}'; 
 const result = template.interpolate({ 
    text: 'Foo Boo' 
 }); 
 console.log(result); 
 
 * @param params 
 * @returns {any} 
 */

String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = names.map(key => params[key]);
    return new Function(...names, `return \`${Array.isArray(this) ? this.join() : this}\`;`)(...vals);
};

/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} unicodeString - Unicode string to be encoded as UTF-8.
 * @returns {string} UTF8-encoded string.
 */
String.prototype.encodeUtf8 = function () {
    const unicodeString = String(this);
    if (typeof unicodeString != "string") throw new TypeError("parameter ‘unicodeString’ is not a string");
    const utf8String = unicodeString
        .replace(
            /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
            }
        )
        .replace(
            /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | (cc >> 12), 0x80 | ((cc >> 6) & 0x3f), 0x80 | (cc & 0x3f));
            }
        );
    return utf8String;
};

/**
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 *
 * Can be achieved JavaScript by decodeURIComponent(escape(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} utf8String - UTF-8 string to be decoded back to Unicode.
 * @returns {string} Decoded Unicode string.
 */
String.prototype.decodeUtf8 = function () {
    const utf8String = String(this);
    if (typeof utf8String != "string") throw new TypeError("parameter ‘utf8String’ is not a string");
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    const unicodeString = utf8String
        .replace(
            /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function (c) {
                // (note parentheses for precedence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            }
        )
        .replace(
            /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function (c) {
                // (note parentheses for precedence)
                var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
                return String.fromCharCode(cc);
            }
        );
    return unicodeString;
};

/**
 * Convert string para base64
 */
String.prototype.toBase64 = function () {
    return new Buffer(this).toString("base64");
};

/** convert string de base64 para utf8 */
String.prototype.toBase64Buffer = function () {
    const base64String = String(this);

    let base64StringWithoutHeader = base64String;
    if (base64String.indexOf(",") > 0)
        base64StringWithoutHeader = base64String.substring(base64String.indexOf(",") + 1);

    return Buffer.from(base64StringWithoutHeader, "base64");
};

/** URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI) under certain circumstances  */
String.prototype.encodeUrl = function () {
    const url = String(this);
    
    if (this.isUrlEncoded()) return url;

    const chaves = url.split("/");
    const filename = encodeURIComponent(chaves.pop());
    chaves.push(filename);
    return chaves.join("/");
};

/** URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI) under certain circumstances  */
String.prototype.decodeUrl = function () {
    const url = String(this);

    const chaves = url.split("/");
    const filename = decodeURIComponent(chaves.pop());
    chaves.push(filename);
    return chaves.join("/");
};

/** Verify is the url is encoded  */
String.prototype.isUrlEncoded = function () {
    const original = String(this);

    return original !== this.decodeUrl(original);
};


/** 
 
 const template = 'Example text: ${text}'; 
 const result = template.interpolate({ 
    text: 'Foo Boo' 
 }); 
 console.log(result); 
 
 * @param params 
 * @returns {any} 
 */
String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = names.map(key => params[key]);
    return new Function(...names, `return \`${Array.isArray(this) ? this.join() : this}\`;`)(...vals);
};

String.prototype.isUtf8 = function () {
    return !/[\p{So}]+/gu.test(this);
}
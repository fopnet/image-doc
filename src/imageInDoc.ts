import * as fs from "fs";
import Pizzip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
// import ImageModule from "docxtemplater-image-module";
import { imageSize } from "image-size";

function base64DataURLToArrayBuffer(imageBase64) {
    const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
    if (!base64Regex.test(imageBase64)) {
        return false;
    }
    const stringBase64 = imageBase64.replace(base64Regex, "");
    let binaryString;
    if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
    } else {
        binaryString = new Buffer(stringBase64, "base64").toString("binary");
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}

export const manipularArquivo = async (documentoWord): Promise<Buffer> => {
    /*
     * Primeira parte do algoritimo.
     *
     * Nessa seção é feita a alteração no arquivo de documento do word usando as bibliotecas "jszip" para abrir o
     * arquivo compactado e 'docxtemplater' para realizar as alterações.
     *
     * Essas bibliotecas fazem apenas metade do trabalho visto que a alteração das chaves e valores nos gráficos não são
     * suportadas.
     */
    //    const zip = new JSZip(documentoWord);
    const pizzip = new Pizzip(documentoWord);
    let docx = new Docxtemplater();

    // const imadeData = base64DataURLToArrayBuffer(
    //     "data:image/jpg;base64,".concat(await fs.readFileSync("/Users/Felipe/Downloads/foto.jpg", "base64"))
    // );
    // const imadeData = await fs.readFileSync("/Users/Felipe/Downloads/foto.jpeg", "latin1");
    const imadeData = "/Users/Felipe/Downloads/foto.jpg";

    const imageCache = {
        //
        image: imadeData,
    };

    const data = { image: imageCache.image };

    const opts = {
        centered: false,
        fileType: "docx", //Or pptx
        getImage: function (tagValue, tagName) {
            // console.log("tagValue:", tagValue);
            // console.log("tagName:", tagName);
            return fs.readFileSync(tagValue);
            // return base64DataURLToArrayBuffer(tagValue);
            // return tagValue;
        },
        getSize: function (buffer, value, tagName, context) {
            const sizeObj = imageSize(buffer);
            // const maxWidth = context.part.containerWidth;
            // const ratio = sizeObj.width / sizeObj.height;
            // let newWidth = Math.min(maxWidth, sizeObj.width);
            // let newHeight = parseInt((newWidth / ratio).toString(), 10);
            // return [newWidth, newHeight];
            console.log(sizeObj);
            return [sizeObj.width, sizeObj.height];
        },
    };

    // Carrega o documento informado que as chaves são delimitadas em colchetes
    docx.attachModule(new ImageModule(opts))
        .loadZip(pizzip)
        // .setOptions({ delimiters: { start: "[", end: "]" } })
        .setData(data);
    // .compile(); // async

    const save = () => {
        const outPut = pizzip.generate({
            type: "nodebuffer",
            // type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); // Output the document using Data-URI

        console.log("data saved");
        return outPut;
    };

    const render = () => {
        try {
            docx = docx.render(); // Monta o documento trocando as chaves por seus respectivos valores

            console.log("rendered");
        } catch (error) {
            const e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            };

            throw e;
        }
    };

    //***********  sync mode
    render();

    const out = save();

    /***********  async mode

    const out = docx
        .resolveData(data)
        .then(function () {
            console.log("data resolved");

            render();

            return save();
        })
        .catch(function (error) {
            console.log("An error occured", error);
        });
    */
    return out;
};

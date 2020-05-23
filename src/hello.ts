import * as fs from "fs";
import { manipularArquivo } from "./imageInDoc";
import "./string.extensions";

const hello = async () => {
    const file = "/Users/Felipe/Downloads/shape2.docx";
    // const file = "/Users/Felipe/Downloads/image.docx";

    let targetBuf = null;
    
    const sourceBuf = await fs.readFileSync(file);

    targetBuf = await manipularArquivo(sourceBuf);
    
    await saveBuffer(targetBuf);

    return "image is inside of document!";
};

const saveBuffer = async buf => {
    fs.writeFile("/Users/Felipe/Downloads/output.docx", buf, "binary", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
};

export { hello };

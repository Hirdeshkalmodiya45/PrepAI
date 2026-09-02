const {PDFLoader}=require("@langchain/community/document_loaders/fs/pdf");
async function loadResume(filepath){
    const loader= new PDFLoader(filepath);
    const docs=loader.load();
    return docs;
}
module.exports = {
    loadResume,
};
import moment from "moment";

const fileFormat= (url="")=>{
    const fileExe=url.split(".").pop();

    if(fileExe==="mp4" || fileExe==="webm" || fileExe==="ogg"){
        return "video";
    }
    if(fileExe==="mp3" || fileExe==="wav" ){
        return "audio";
    }
    if(fileExe==="jpg" || fileExe==="png" || fileExe==="jpeg" || fileExe==="gif" ){
        return "image";
    }

    return "file";

}

const transformImage=(url="",width=100)=>{

    const newUrl=url.replace("upload/",`upload/dpr_auto/w_${width}/`)

    return newUrl;
}


 const getLast7Days=()=>{
    const currentDate = moment();
    const last7Days = [];

    for(let i=0; i<7; i++){
        const dayDate=currentDate.clone().subtract(i, 'days');
        const dayName=dayDate.format("dddd");
        last7Days.unshift(dayName);
    }

    return last7Days;


}

const getOrSaveFromStorage=({key,value,get})=>{

    if(get){
        return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):null;
    }

    else{
        localStorage.setItem(key,JSON.stringify(value));
    }

};

export {fileFormat,getLast7Days,transformImage,getOrSaveFromStorage};
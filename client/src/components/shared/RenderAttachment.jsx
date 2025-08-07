import React from 'react'
import { transformImage } from '../../libs/features';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

const RenderAttachment = (file, url) => {
    
    

    switch (file) {
        case "video":
            return <video src={url} preload='none' width={"200px"} controls />
            

        case "audio":
            return <audio src={url} preload='none' controls></audio>
           

        case "image":
            return <img src={transformImage(url)}
                alt="Attachment" 
                width={"200px"} 
                height={"200px"} 
                style={{
                    objectFit: "contain"
                }} />
                

        default:
             <FileOpenIcon/>

            
        }
        
        
    return(
        <>
        </>
    )
   
}

export default RenderAttachment
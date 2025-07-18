import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../libs/features';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({message,user}) => {

    const {attachments=[],content,sender,createdAt}=message;
    const sameSender= sender?._id===user?._id;
    const timeAgo=moment(createdAt).fromNow();
   
    
  return (
    <div className={`${sameSender ? "self-end" : "self-start"} bg-white text-black rounded p-2 w-fit`}>
        {!sameSender && <div className='text-sm text-[#2694ab]'>{sender.name}</div>}
        {content && <div>{content}</div>}

        {/* Attachments */}
        {attachments.length>0 &&
        attachments.map((attachment,i)=>{
            const url=attachment.url;
            const file=fileFormat(url);
            console.log(file);
            return(
                <Box key={i}>
                    <a 
                        href={url}
                        target='_blank'
                        download
                        style={{
                            color:"black"
                        }}
                        >
                            {RenderAttachment(file,url)}

                        </a>
                </Box>
            )
        })
        }

        {/* createAt */}
        {timeAgo && <div className=' flex text-[10px] text-gray-500 justify-end'>{timeAgo}</div>}
</div>

  )
}

export default memo(MessageComponent)
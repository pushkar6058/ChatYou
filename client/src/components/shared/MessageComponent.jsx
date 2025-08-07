import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react';
import { fileFormat } from '../../libs/features';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({ message, user }) => {
  const { attachments = [], content, sender, createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <div className={`flex ${sameSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`bg-white text-black rounded p-2 w-fit max-w-[80%]`}>
        {/* Sender name (only for messages not sent by current user) */}
        {!sameSender && (
          <div className="text-sm text-[#2694ab] font-medium mb-1">
            {sender.name}
          </div>
        )}

        {/* Text content */}
        {content && <div className="mb-1">{content}</div>}

        {/* Attachments */}
        {attachments.length > 0 &&
          attachments.map((attachment, i) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <Box key={i}>
                <a
                  href={url}
                  target="_blank"
                  download
                  style={{ color: 'black' }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        {/* Timestamp */}
        {timeAgo && (
          <div className="flex text-[10px] text-gray-500 justify-end mt-1">
            {timeAgo}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessageComponent);

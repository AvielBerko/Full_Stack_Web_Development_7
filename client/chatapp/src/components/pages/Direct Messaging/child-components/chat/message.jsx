import React from "react";

export default function Message({ message, isSentByUser }) {
    const senderStyle = isSentByUser
      ? { alignSelf: 'flex-end', backgroundColor: '#007bff', color: '#fff', margin: '5px' }
      : { alignSelf: 'flex-start', backgroundColor: '#b0b0b0', color: '#000', margin: '5px' };
  
    return (
      <div
        key={message.id}
        style={{
          padding: '8px',
          borderRadius: '8px',
          marginBottom: '8px',
          maxWidth: '50%',
          ...senderStyle,
        }}
      >
        <div style={{ marginBottom: '4px' }}>{message.message}</div>
        <div style={{ fontSize: '12px', textAlign: 'right' }}>
          {new Date(message.time_sent).toLocaleString()}
        </div>
      </div>
    );
  };
import React from 'react';

const Page = ({ params: { foodId } }) => {
    const a = 12;
    return (
        <div>
            {foodId}
        </div>
    );
}

export default Page;

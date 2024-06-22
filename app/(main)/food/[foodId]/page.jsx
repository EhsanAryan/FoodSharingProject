import React from 'react';

const Page = ({ params: { foodId } }) => {
    return (
        <div>
            {foodId}
        </div>
    );
}

export default Page;

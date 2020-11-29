import React from 'react';
import styled from '@emotion/styled'

import Swatches from '@/pages/components/Swatches'
import Brand from '@/pages/components/Brand'

export default () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
      <Swatches
        width={700}
        height={500}
      />
      <Brand />
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* background: ; */
`

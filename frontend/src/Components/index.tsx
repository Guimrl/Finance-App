import styled, { css, keyframes } from 'styled-components'

export const Container = styled('div')`
  min-height: 100vh;
  background-color: #292929;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const DashboardWrapper = styled('div')`
  width: 100%;
  max-width: 1200px;
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background-color: #292929;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const IconWrapper = styled.div`
  padding: 0.5rem;
  background-color: #eab308;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`

export const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span.dot {
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 9999px;
    background-color: ${props => (props.$connected ? '#22c55e' : '#ef4444')};
    animation: ${props =>
      props.$connected
        ? css`
            ${fadeIn} 1s infinite alternate
          `
        : 'none'};
  }

  span.text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #d1d5db;
  }
`

import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const TicketAdvancedLayout = styled(Paper)({
    height: `calc(100% - 48px)`,
    display: "grid",
    gridTemplateRows: "56px 1fr",
    backgroundColor: "#f5f5f5",
    boxShadow: "none",
    border: "none",
})

export default TicketAdvancedLayout;
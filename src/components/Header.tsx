interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
    return (
        <header style={headerStyle}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    padding: "2rem",
    backgroundColor: "#eef2ff",
    textAlign: "center",
};

export default Header;

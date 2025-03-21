const Sidebar = () => {
    return (
      <aside style={styles.sidebar}>
        <h2>Sidebar</h2>
      </aside>
    );
  };
  
  const styles = {
    sidebar: {
      width: '200px',
      backgroundColor: '#f4f4f4',
      padding: 0,
      height: '100%', // Take full height of the container
    },
  };
  
  export default Sidebar;
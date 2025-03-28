function LogoutButton({ logout }) {
  return (
    <button
      onClick={logout}
      className="
        px-4 py-2
        bg-white
        border border-red-300
        text-red-500 hover:text-white
        hover:bg-red-500
        rounded-lg
        shadow-sm hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-400
        active:bg-red-600
        cursor-pointer
      "
    >
      Logout
    </button>
  );
}

export default LogoutButton;
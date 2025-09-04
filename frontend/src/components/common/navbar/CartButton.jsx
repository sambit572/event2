// NavbarCart.jsx
import { FaCartShopping } from "react-icons/fa6";

const CartButton = ({ cartCount, handleAddToCart }) => {
  return (
    <div
      onClick={handleAddToCart}
      className="flex items-center justify-center gap-1 text-[#001f3f] font-semibold 
                 cursor-pointer px-2 py-1 rounded-md
                 transition-all duration-300 
                 hover:bg-[#001f3f] hover:text-white hover:scale-105"
    >
      {/* Icon with Badge */}
      <div className="relative flex items-center text-xl sm:text-lg">
        <FaCartShopping className="transition-transform duration-300 group-hover:rotate-6" />
        {cartCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-600 text-white border border-white rounded-full 
                          text-[10px] font-bold h-4 min-w-4 px-1 flex justify-center items-center leading-none"
          >
            {cartCount}
          </span>
        )}
      </div>

      {/* Cart Text (Hidden on smaller screens) */}
      <div className="hidden sm:block text-base">Cart</div>
    </div>
  );
};

export default CartButton;

import bannerOne from "@/assets/banner-1.webp";
import bannerTwo from "@/assets/banner-2.webp";
import bannerThree from "@/assets/banner-3.webp";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useFilter } from "@/components/shopping-view/UseFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFilteredProducts } from "@/store/shop-products-slice";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "FootWear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "hnm", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSldie] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const slides = [bannerOne, bannerTwo, bannerThree];
  const navigate = useNavigate();
  const { setCheckFilter } = useFilter();

  function handleLinkClick(itemId, filterOption) {
    const filter = {
      category: [],
      brand: [],
    };
    filter[filterOption] = [itemId];
    navigate(`/shop/listing`);
    setCheckFilter(filter);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSldie((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(getFilteredProducts({ filter: "", sortBy: "price-lowtohigh" }));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative h-[600px] w-full overflow-hidden">
        {slides.map((slide, index) => {
          return (
            <img
              src={slide}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000`}
            />
          );
        })}
        <Button
          className={`absolute left-4 top-1/2 -translate-y-1/2 transform bg-white/80`}
          variant="outline"
          size="icon"
          onClick={() => {
            setCurrentSldie(
              (prevSldie) => (prevSldie - 1 + slides.length) % slides.length,
            );
          }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          className="absolute right-4 top-1/2 -translate-y-1/2 transform bg-white/80"
          variant="outline"
          size="icon"
          onClick={() => {
            setCurrentSldie((prevSldie) => (prevSldie + 1) % slides.length);
          }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => {
                  handleLinkClick(item.id, "category");
                }}
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="mb-4 h-12 w-12 text-primary" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Shop by Brand</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => {
                  handleLinkClick(brandItem.id, "brand");
                }}
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="mb-4 h-12 w-12 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Feature Products
        </h2>
        <div className="grid grid-cols-1 gap-6 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  showOption="home"
                  product={productItem}
                />
              ))
            : ""}
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;

import { ReactNode } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import * as Pages from "@/pages";

// Route configuration that can be adapted for React Native later
export const ROUTES = {
  INDEX: "/",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  LUCKY_DRAW: "/lucky-draw",
  SHOP: "/shop",
  PRODUCT_DETAIL: "/shop/product/:id",
  SELL: "/sell",
  PAYMENT: "/payment",
  GAMES: "/games",
  GAME_2048: "/games/2048",
  SOCIAL: "/social",
  HEALTH: "/health",
} as const;

// Navigation functions that abstract the routing implementation
export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate(ROUTES.INDEX),
    goToSignup: () => navigate(ROUTES.SIGNUP),
    goToProfile: () => navigate(ROUTES.PROFILE),
    goToLuckyDraw: () => navigate(ROUTES.LUCKY_DRAW),
    goToShop: () => navigate(ROUTES.SHOP),
    goToProductDetail: (id: string) => navigate(`/shop/product/${id}`),
    goToSell: () => navigate(ROUTES.SELL),
    goToPayment: () => navigate(ROUTES.PAYMENT),
    goToGames: () => navigate(ROUTES.GAMES),
    goTo2048: () => navigate(ROUTES.GAME_2048),
    goToSocial: () => navigate(ROUTES.SOCIAL),
    goToHealth: () => navigate(ROUTES.HEALTH),
    goBack: () => navigate(-1),
  };
};

interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Routes configuration that can be adapted for different navigation systems
const routes: RouteConfig[] = [
  { path: ROUTES.INDEX, element: <Pages.Index /> },
  { path: ROUTES.SIGNUP, element: <Pages.Signup /> },
  { path: ROUTES.PROFILE, element: <Pages.Profile /> },
  { path: ROUTES.LUCKY_DRAW, element: <Pages.LuckyDraw /> },
  { path: ROUTES.SHOP, element: <Pages.Shop /> },
  { path: ROUTES.PRODUCT_DETAIL, element: <Pages.ProductDetail /> },
  { path: ROUTES.SELL, element: <Pages.Sell /> },
  { path: ROUTES.PAYMENT, element: <Pages.Payment /> },
  { path: ROUTES.GAMES, element: <Pages.Games /> },
  { path: ROUTES.GAME_2048, element: <Pages.Game2048 /> },
  { path: ROUTES.SOCIAL, element: <Pages.Social /> },
  { path: ROUTES.HEALTH, element: <Pages.Health /> },
];

export const AppNavigator = () => {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};
import { ReactNode } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import * as Pages from "@/pages";

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
  GAME_SUDOKU: "/games/sudoku",
  SOCIAL: "/social",
  HEALTH: "/health",
  EARNINGS: "/earnings",
} as const;

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
    goToSudoku: () => navigate(ROUTES.GAME_SUDOKU),
    goToSocial: () => navigate(ROUTES.SOCIAL),
    goToHealth: () => navigate(ROUTES.HEALTH),
    goToEarnings: () => navigate(ROUTES.EARNINGS),
    goBack: () => navigate(-1),
  };
};

interface RouteConfig {
  path: string;
  element: ReactNode;
}

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
  { path: ROUTES.GAME_SUDOKU, element: <Pages.Sudoku /> },
  { path: ROUTES.SOCIAL, element: <Pages.Social /> },
  { path: ROUTES.HEALTH, element: <Pages.Health /> },
  { path: ROUTES.EARNINGS, element: <Pages.Earnings /> },
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
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { type SubmitHandler } from "react-hook-form";
import axios from "axios";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaApple, FaGoogle } from "react-icons/fa";

const OAUTH_URL = {
  GOOGLE: import.meta.env.VITE_GOOGLE_AUTH_URL,
  KAKAO: import.meta.env.VITE_KAKAO_AUTH_URL,
  APPLE: import.meta.env.VITE_APPLE_AUTH_URL,
} as const;

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    profileImage: string;
  };
}

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginRequest>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/");
    },
    onError: () => {
      toast.error("이메일 또는 비밀번호를 확인해주세요.");
    },
  });

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutation.mutate(data);
  };

  const handleOAuthLogin = (provider: keyof typeof OAUTH_URL) => {
    window.location.href = OAUTH_URL[provider];
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-10 p-10 bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.03)]">
        <div className="text-center space-y-4">
          <img className="mx-auto h-14 w-auto" src="/logo.svg" alt="Orbit" />
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to continue to your workspace
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                {...register("email")}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                {...register("password")}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="relative w-full h-12 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <button
              onClick={() => handleOAuthLogin("GOOGLE")}
              className="flex justify-center items-center h-12 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200"
            >
              <FaGoogle size={24} />
            </button>

            <button
              onClick={() => handleOAuthLogin("KAKAO")}
              className="flex justify-center items-center h-12 bg-[#FEE500] rounded-xl hover:bg-[#FDD835] transition-colors duration-200"
            >
              <RiKakaoTalkFill size={24} />
            </button>

            <button
              onClick={() => handleOAuthLogin("APPLE")}
              className="flex justify-center items-center h-12 bg-black rounded-xl hover:bg-gray-800 transition-colors duration-200"
            >
              <FaApple color="white" size={24} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

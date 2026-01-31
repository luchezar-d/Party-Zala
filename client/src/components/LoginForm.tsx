import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { simpleAuth } from '../lib/simpleAuth';
import { Calendar, Mail, Lock, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple auth: just call the login endpoint
      // Server validates credentials, we just mark as logged in
      await api.post('/auth/login', { 
        email: data.email, 
        password: data.password 
      });
      
      // If successful, mark as logged in and redirect
      simpleAuth.setLoggedIn();
      navigate('/calendar');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:px-6 lg:px-8 login-container">
      <div className="card login-card p-5 sm:p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center login-header mb-5 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 login-logo p-2.5 sm:p-3 rounded-xl sm:rounded-2xl">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="login-title text-lg sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 px-2 leading-tight">
            Welcome to Party Zala! 🎉
          </h1>
          <p className="login-subtitle text-xs sm:text-base text-gray-600 px-2 leading-relaxed">
            Sign in to manage your kids' party calendar
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start sm:items-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-red-800 text-xs sm:text-sm leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-3.5 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <div className="relative login-input-wrapper">
              <Mail className="absolute left-3 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className={`login-input input-field pl-10 sm:pl-10 w-full text-sm sm:text-base ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <div className="relative login-input-wrapper">
              <Lock className="absolute left-3 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                className={`login-input input-field pl-10 sm:pl-10 pr-12 sm:pr-12 w-full text-sm sm:text-base ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-eye-toggle absolute right-0 top-0 h-full flex items-center justify-center w-12 sm:w-12 text-gray-400 hover:text-gray-600 active:text-gray-700 text-lg sm:text-xl transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-submit w-full btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-5 sm:mt-8 active:scale-[0.98] transition-transform"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

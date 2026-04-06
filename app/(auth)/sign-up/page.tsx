'use client';

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {OCCUPATION_OPTIONS, DAILY_EXERCISE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import {signUpWithEmail} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            phone: '',
            age: '',
            weight: '',
            height: '',
            country: 'IN',
            monthlyIncome: '',
            occupation: 'Software Developer',
            dailyExercise: '30 mins'
        },
        mode: 'onBlur'
    }, );

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if(result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign up failed', {
                description: e instanceof Error ? e.message : 'Failed to create an account.'
            })
        }
    }

    return (
        <>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">Set up your profile for personalized AI financial suggestions</p>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                {/* ── Section: Personal Details ── */}
                <div className="auth-section-label">Personal Details</div>

                <div className="auth-field-row">
                    <InputField
                        name="fullName"
                        label="Full Name"
                        placeholder="Divyansh Nagar"
                        register={register}
                        error={errors.fullName}
                        validation={{ required: 'Full name is required', minLength: 2 }}
                    />
                    <InputField
                        name="email"
                        label="Email"
                        placeholder="divyansh@moneymint.local"
                        register={register}
                        error={errors.email}
                        validation={{ required: 'Email is required', pattern: { value: /^\w+@\w+\.\w+$/, message: 'Enter a valid email' } }}
                    />
                </div>

                <div className="auth-field-row">
                    <InputField
                        name="password"
                        label="Password"
                        placeholder="Enter a strong password"
                        type="password"
                        register={register}
                        error={errors.password}
                        validation={{ required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }}
                    />
                    <InputField
                        name="phone"
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        register={register}
                        error={errors.phone}
                        validation={{ required: 'Phone number is required' }}
                    />
                </div>

                {/* ── Section: Health & Personal Info ── */}
                <div className="auth-section-label" style={{ marginTop: '0.5rem' }}>Health & Personal Info</div>

                <div className="auth-field-row">
                    <InputField
                        name="age"
                        label="Age"
                        placeholder="24"
                        register={register}
                        error={errors.age}
                        validation={{ required: 'Age is required' }}
                    />
                    <InputField
                        name="weight"
                        label="Weight (kg)"
                        placeholder="68"
                        register={register}
                        error={errors.weight}
                        validation={{ required: 'Weight is required' }}
                    />
                </div>

                <div className="auth-field-row">
                    <InputField
                        name="height"
                        label="Height (cm)"
                        placeholder="175"
                        register={register}
                        error={errors.height}
                        validation={{ required: 'Height is required' }}
                    />
                    <InputField
                        name="monthlyIncome"
                        label="Monthly Income (₹)"
                        placeholder="₹45000"
                        register={register}
                        error={errors.monthlyIncome}
                        validation={{ required: 'Monthly income is required' }}
                    />
                </div>

                <div className="auth-field-row">
                    <CountrySelectField
                        name="country"
                        label="Country"
                        control={control}
                        error={errors.country}
                        required
                    />

                    <SelectField
                        name="occupation"
                        label="Occupation"
                        placeholder="Select your occupation"
                        options={OCCUPATION_OPTIONS}
                        control={control}
                        error={errors.occupation}
                        required
                    />
                </div>

                <SelectField
                    name="dailyExercise"
                    label="Daily Exercise"
                    placeholder="Select exercise duration"
                    options={DAILY_EXERCISE_OPTIONS}
                    control={control}
                    error={errors.dailyExercise}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
            </form>
        </>
    )
}
export default SignUp;

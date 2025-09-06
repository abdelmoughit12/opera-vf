import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const YupForm = ({ 
  schema, 
  defaultValues = {}, 
  onSubmit, 
  children, 
  className = "",
  resetOnSubmit = true 
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const formContext = {
    register,
    setValue,
    reset,
    watch,
    errors,
    isSubmitting,
    isValid
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      {typeof children === 'function' ? children(formContext) : children}
    </form>
  );
};

// Composant pour les champs de saisie avec validation
export const FormField = ({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false,
  options = [], // Pour les select
  rows = 4, // Pour les textarea
   disabled = false,
  register,
  errors,
  className = ""
}) => {
  const fieldError = errors[name];
  const isRequired = required || (register && register(name)?.required);

  const baseClasses = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`;
  const errorClasses = fieldError ? 'border-red-300' : 'border-gray-300';

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            {...register(name)}
             disabled={disabled} 
            className={`${baseClasses} ${errorClasses}`}
          >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...register(name)}
            rows={rows}
             disabled={disabled} 
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses} resize-none`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            {...register(name)}
             disabled={disabled} 
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      default:
        return (
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderField()}
      {fieldError && (
        <p className="text-sm text-red-600">{fieldError.message}</p>
      )}
    </div>
  );
};

// Composant pour les boutons de soumission
export const SubmitButton = ({ 
  children, 
  isSubmitting, 
  disabled = false,
  className = "px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className={className}
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Sauvegarde...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default YupForm; 
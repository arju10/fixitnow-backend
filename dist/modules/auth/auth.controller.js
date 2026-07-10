import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { registerUser, loginUser, getCurrentUser } from './auth.service';
export const register = catchAsync(async (req, res) => {
    const input = req.body;
    const result = await registerUser(input);
    sendResponse(res, 201, 'User registered successfully', result);
});
export const login = catchAsync(async (req, res) => {
    const input = req.body;
    const result = await loginUser(input);
    sendResponse(res, 200, 'Login successful', result);
});
export const getMe = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const user = await getCurrentUser(req.user.id);
    sendResponse(res, 200, 'User fetched successfully', user);
});
//# sourceMappingURL=auth.controller.js.map
/**
 * Implementation A: Mathematical Formula (Arithmetic Progression)
 * 
 * Time Complexity: O(1)
 * This is the most efficient approach. It calculates the sum directly using
 * Gauss's formula for the sum of an arithmetic sequence: (n * (n + 1)) / 2.
 * The time taken to execute this is constant regardless of the size of 'n'.
 * 
 * Space Complexity: O(1)
 * It only requires a few basic arithmetic operations, so memory usage is constant.
 */
function sum_to_n_a(n: number): number {
	return (n * (n + 1)) / 2;
}

/**
 * Implementation B: Iterative Approach (Loop)
 * 
 * Time Complexity: O(n)
 * This approach uses a loop to iterate from 1 up to 'n', adding 'i' to a sum
 * variable in each step. The execution time grows linearly with the size of 'n'.
 * 
 * Space Complexity: O(1)
 * Memory usage remains constant since it only maintains a single 'sum' variable
 * and a loop counter 'i', irrespective of how large 'n' is.
 */
function sum_to_n_b(n: number): number {
	let sum = 0;
	for (let i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
}

/**
 * Implementation C: Recursive Approach
 * 
 * Time Complexity: O(n)
 * This approach calls itself 'n' times. Similar to the iterative approach,
 * the time taken grows linearly with 'n'.
 * 
 * Space Complexity: O(n)
 * Each recursive call gets added to the call stack in memory. Therefore, 
 * the memory required grows linearly with 'n'. If 'n' is extremely large, 
 * this could theoretically lead to a stack overflow error, making it the least 
 * space-efficient approach of the three.
 */
function sum_to_n_c(n: number): number {
	if (n <= 0) {
		return 0; // Handle edge cases for numbers <= 0
	}
	return n + sum_to_n_c(n - 1);
}
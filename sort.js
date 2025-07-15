
        class SortingVisualizer {
            constructor() {
                this.array = [];
                this.arraySize = 50;
                this.maxValue = 100;
                this.delay = 50;
                this.isRunning = false;
                this.isPaused = false;
                this.comparisons = 0;
                this.swaps = 0;

                // DOM elements
                this.arrayContainer = document.getElementById('arrayContainer');
                this.generateArrayBtn = document.getElementById('generateArray');
                this.algorithmSelect = document.getElementById('algorithm');
                this.startBtn = document.getElementById('start');
                this.pauseBtn = document.getElementById('pause');
                this.resetBtn = document.getElementById('reset');
                this.speedInput = document.getElementById('speed');
                this.comparisonsElement = document.getElementById('comparisons');
                this.swapsElement = document.getElementById('swaps');

                this.initializeEventListeners();
                this.generateNewArray();
            }

            initializeEventListeners() {
                this.generateArrayBtn.addEventListener('click', () => this.generateNewArray());
                this.startBtn.addEventListener('click', () => this.startSorting());
                this.pauseBtn.addEventListener('click', () => this.togglePause());
                this.resetBtn.addEventListener('click', () => this.reset());
                this.speedInput.addEventListener('input', (e) => {
                    this.delay = 101 - parseInt(e.target.value);
                });
            }

            generateNewArray() {
                this.array = Array.from({length: this.arraySize}, () => 
                    Math.floor(Math.random() * this.maxValue) + 1);
                this.updateDisplay();
                this.reset();
            }

            updateDisplay() {
                this.arrayContainer.innerHTML = '';
                const barWidth = Math.floor((this.arrayContainer.clientWidth - this.arraySize * 2) / this.arraySize);
                
                this.array.forEach((value, idx) => {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.height = `${value * 3}px`;
                    bar.style.width = `${barWidth}px`;
                    this.arrayContainer.appendChild(bar);
                });
            }

            async startSorting() {
                if (this.isRunning) return;
                this.isRunning = true;
                this.isPaused = false;
                
                switch (this.algorithmSelect.value) {
                    case 'bubble':
                        await this.bubbleSort();
                        break;
                    case 'selection':
                        await this.selectionSort();
                        break;
                    case 'insertion':
                        await this.insertionSort();
                        break;
                    case 'quick':
                        await this.quickSort(0, this.array.length - 1);
                        break;
                    case 'merge':
                        await this.mergeSort(0, this.array.length - 1);
                        break;
                }

                this.isRunning = false;
            }

            togglePause() {
                this.isPaused = !this.isPaused;
                this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
            }

            reset() {
                this.isRunning = false;
                this.isPaused = false;
                this.comparisons = 0;
                this.swaps = 0;
                this.updateStats();
            }

            updateStats() {
                this.comparisonsElement.textContent = this.comparisons;
                this.swapsElement.textContent = this.swaps;
            }

            async sleep() {
                while (this.isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return new Promise(resolve => setTimeout(resolve, this.delay));
            }

            async swap(i, j) {
                await this.sleep();
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.swaps++;
                this.updateDisplay();
                this.updateStats();
            }

            // Sorting Algorithms
            async bubbleSort() {
                for (let i = 0; i < this.array.length; i++) {
                    for (let j = 0; j < this.array.length - i - 1; j++) {
                        this.comparisons++;
                        if (this.array[j] > this.array[j + 1]) {
                            await this.swap(j, j + 1);
                        }
                    }
                }
            }

            async selectionSort() {
                for (let i = 0; i < this.array.length; i++) {
                    let minIdx = i;
                    for (let j = i + 1; j < this.array.length; j++) {
                        this.comparisons++;
                        if (this.array[j] < this.array[minIdx]) {
                            minIdx = j;
                        }
                    }
                    if (minIdx !== i) {
                        await this.swap(i, minIdx);
                    }
                }
            }

            async insertionSort() {
                for (let i = 1; i < this.array.length; i++) {
                    let j = i;
                    while (j > 0 && this.array[j - 1] > this.array[j]) {
                        this.comparisons++;
                        await this.swap(j, j - 1);
                        j--;
                    }
                }
            }

            async quickSort(low, high) {
                if (low < high) {
                    const pivot = await this.partition(low, high);
                    await this.quickSort(low, pivot - 1);
                    await this.quickSort(pivot + 1, high);
                }
            }

            async partition(low, high) {
                const pivot = this.array[high];
                let i = low - 1;

                for (let j = low; j < high; j++) {
                    this.comparisons++;
                    if (this.array[j] < pivot) {
                        i++;
                        await this.swap(i, j);
                    }
                }
                await this.swap(i + 1, high);
                return i + 1;
            }

            async mergeSort(left, right) {
                if (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    await this.mergeSort(left, mid);
                    await this.mergeSort(mid + 1, right);
                    await this.merge(left, mid, right);
                }
            }

            async merge(left, mid, right) {
                const n1 = mid - left + 1;
                const n2 = right - mid;
                const L = new Array(n1);
                const R = new Array(n2);

                for (let i = 0; i < n1; i++) L[i] = this.array[left + i];
                for (let j = 0; j < n2; j++) R[j] = this.array[mid + 1 + j];

                let i = 0, j = 0, k = left;

                while (i < n1 && j < n2) {
                    this.comparisons++;
                    await this.sleep();
                    if (L[i] <= R[j]) {
                        this.array[k] = L[i];
                        i++;
                    } else {
                        this.array[k] = R[j];
                        j++;
                    }
                    this.updateDisplay();
                    k++;
                }

                while (i < n1) {
                    await this.sleep();
                    this.array[k] = L[i];
                    i++;
                    k++;
                    this.updateDisplay();
                }

                while (j < n2) {
                    await this.sleep();
                    this.array[k] = R[j];
                    j++;
                    k++;
                    this.updateDisplay();
                }
            }
        }

        // Initialize the visualizer when the page loads
        window.addEventListener('load', () => {
            new SortingVisualizer();
        });
    
#include <iostream>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Usage: ./hello <number>" << endl;
        return 1;
    }

    int x = atoi(argv[1]);

    if (x <= 0) {
        cout << "Please provide a positive number." << endl;
        return 1;
    }

    for (int i = 1; i <= x; i++) {
        cout << "hello " << i << endl;
    }

    return 0;
}

#include <iostream>
#include "joule_thompson.hpp"
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 6) {
        cout << "Usage: ./jt_sim P1 P2 T dt totalTime\n";
        return 1;
    }

    double P1 = atof(argv[1]);
    double P2 = atof(argv[2]);
    double T = atof(argv[3]);
    double dt = atof(argv[4]);
    double totalTime = atof(argv[5]);

    JouleThomsonSimulation sim(P1, P2, T, dt, totalTime);
    sim.run();
    sim.displayFinal();

    return 0;
}
function fakeLoader(request, parent, isMain) {
    var subst, allow, file;
    if (!this.originalLoader) {
        throw new Error('Loader has not been hooked');
    }

    if (this.registeredMocks.hasOwnProperty(request)) {
        return this.registeredMocks[request];
    }

    if (this.registeredSubstitutes.hasOwnProperty(request)) {
        subst = this.registeredSubstitutes[request];
        if (!subst.module && subst.name) {
            subst.module = this.originalLoader(subst.name, parent, isMain);
        }
        if (!subst.module) {
            throw new Error('Misconfigured substitute for "' + request + '"');
        }
        return subst.module;
    }

    if (this.registeredAllowables.hasOwnProperty(request)) {
        allow = this.registeredAllowables[request];
        if (allow.unhook) {
            file = this.resolveFilename(request, parent);
            if (file.indexOf('/') !== -1 && allow.paths.indexOf(file) === -1) {
                allow.paths.push(file);
            }
        }
    } else {
        if (this.options.warnOnUnregistered) {
            console.warn('WARNING: loading non-allowed module: ' + request);
        }

        if (this.options.errorOnUnregistered) {
            throw 'ERROR: loading non-allowed module: ' + request;
        }
    }

    return this.originalLoader(request, parent, isMain);
}

module.exports = fakeLoader;